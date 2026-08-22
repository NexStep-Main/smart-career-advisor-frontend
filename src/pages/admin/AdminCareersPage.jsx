import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Pencil, Trash2, Briefcase, SlidersHorizontal, X, Archive } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import SEOHead from "@/components/common/SEOHead";
import CareerFormModal from "@/components/admin/CareerFormModal";
import { getAdminCareers } from "@/services/admin";
import { createCareer, updateCareer, deleteCareer } from "@/services/careers";
import { DOMAINS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const DEMAND_VARIANT = { high: "green", medium: "orange", low: "neutral" };
const DEMAND_LEVELS = [
  { value: "", label: "All demand levels" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];
const STATUS_FILTERS = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active only" },
  { value: "archived", label: "Archived only" },
];

const selectClass =
  "h-11 min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 text-sm text-slate-700 dark:text-slate-200 focus:border-primary focus:outline-none sm:flex-none";

export default function AdminCareersPage() {
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("");
  const [demandLevel, setDemandLevel] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const queryClient = useQueryClient();

  const filters = {
    search: search || undefined,
    domain: domain || undefined,
    demandLevel: demandLevel || undefined,
    status: status || undefined,
  };
  const activeFilterCount = [domain, demandLevel, status].filter(Boolean).length;
  const hasFilters = !!search || activeFilterCount > 0;

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "careers", { ...filters, page }],
    queryFn: () => getAdminCareers({ ...filters, page, limit: 10 }).then((res) => res.data.data),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "careers"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
  };

  const createMutation = useMutation({
    mutationFn: createCareer,
    onSuccess: () => {
      toast.success("Career created");
      invalidate();
      setFormOpen(false);
    },
    onError: () => toast.error("Couldn't create career. Check the form and try again."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateCareer(id, payload),
    onSuccess: () => {
      toast.success("Career updated");
      invalidate();
      setFormOpen(false);
      setEditingCareer(null);
    },
    onError: () => toast.error("Couldn't update career. Check the form and try again."),
  });

  const archiveMutation = useMutation({
    mutationFn: (career) => {
      const { id, ...rest } = career;
      delete rest.salaryRange;
      return updateCareer(id, { ...rest, isActive: false });
    },
    onSuccess: () => {
      toast.success("Career archived — hidden from students, data kept.");
      invalidate();
    },
    onError: () => toast.error("Couldn't archive this career."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCareer,
    onSuccess: () => {
      toast.success("Career deleted");
      invalidate();
      setDeleteTarget(null);
    },
    onError: (error, id) => {
      setDeleteTarget(null);
      if (error.response?.status === 409) {
        const career = careers.find((c) => c.id === id);
        toast(
          (t) => (
            <div className="flex flex-col gap-2">
              <p className="text-sm">{error.response.data.message}</p>
              {career && (
                <Button
                  size="sm"
                  variant="admin"
                  onClick={() => {
                    archiveMutation.mutate(career);
                    toast.dismiss(t.id);
                  }}
                >
                  <Archive size={14} />
                  Archive instead
                </Button>
              )}
            </div>
          ),
          { duration: 8000 },
        );
        return;
      }
      toast.error("Couldn't delete career.");
    },
  });

  const handleFormSubmit = (values) => {
    if (editingCareer) {
      updateMutation.mutate({ id: editingCareer.id, payload: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const toggleStatus = (career) => {
    const { id, ...rest } = career;
    delete rest.salaryRange;
    updateMutation.mutate({ id, payload: { ...rest, isActive: !career.isActive } });
  };

  const clearFilters = () => {
    setSearch("");
    setDomain("");
    setDemandLevel("");
    setStatus("");
    setPage(1);
  };

  const careers = data?.careers ?? [];

  return (
    <div className="flex flex-col gap-6">
      <SEOHead title="Manage Careers" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Console / Careers
          </span>
          <h1 className="mt-1 font-display text-3xl text-slate-900 dark:text-slate-50">
            Manage Careers
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {data?.total ?? 0} career{data?.total === 1 ? "" : "s"} matching current filters
          </p>
        </div>
        <Button
          variant="admin"
          onClick={() => {
            setEditingCareer(null);
            setFormOpen(true);
          }}
        >
          <Plus size={16} />
          Add Career
        </Button>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <input
              type="text"
              placeholder="Search by title or domain…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            className="shrink-0 lg:hidden"
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <SlidersHorizontal size={14} />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 flex size-4 items-center justify-center rounded-full bg-admin-accent text-[10px] text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="hidden shrink-0 items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-red-500 lg:flex"
            >
              <X size={13} />
              Clear filters
            </button>
          )}
        </div>

        <div className={cn("flex-wrap gap-2 lg:flex", filtersOpen ? "flex" : "hidden lg:flex")}>
          <select
            value={domain}
            onChange={(e) => {
              setDomain(e.target.value);
              setPage(1);
            }}
            className={selectClass}
          >
            <option value="">All domains</option>
            {DOMAINS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={demandLevel}
            onChange={(e) => {
              setDemandLevel(e.target.value);
              setPage(1);
            }}
            className={selectClass}
          >
            {DEMAND_LEVELS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className={selectClass}
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex w-fit items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-red-500 lg:hidden"
            >
              <X size={13} />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : careers.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No careers found"
          description={
            hasFilters
              ? "Try different filters or clear them to see everyone."
              : "Add your first career to get started."
          }
          action={
            hasFilters && (
              <Button size="sm" variant="admin" onClick={clearFilters}>
                Clear filters
              </Button>
            )
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border font-mono text-[10.5px] uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-2.5 font-semibold sm:px-6">Career</th>
                  <th className="px-4 py-2.5 font-semibold sm:px-6">Domain</th>
                  <th className="px-4 py-2.5 font-semibold sm:px-6">Demand</th>
                  <th className="px-4 py-2.5 font-semibold sm:px-6">Salary</th>
                  <th className="px-4 py-2.5 font-semibold sm:px-6">Status</th>
                  <th className="px-4 py-2.5 font-semibold sm:px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {careers.map((career) => (
                  <tr key={career.id} className="border-b border-border last:border-0">
                    <td className="max-w-55 px-4 py-2.5 sm:px-6">
                      <div className="truncate font-medium text-slate-900 dark:text-slate-50">
                        {career.title}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300 sm:px-6">
                      {career.domain}
                    </td>
                    <td className="px-4 py-2.5 sm:px-6">
                      <Badge variant={DEMAND_VARIANT[career.demandLevel] ?? "neutral"}>
                        {career.demandLevel}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-slate-600 dark:text-slate-300 sm:px-6">
                      {career.salaryRange}
                    </td>
                    <td className="px-4 py-2.5 sm:px-6">
                      <button
                        onClick={() => toggleStatus(career)}
                        disabled={updateMutation.isPending}
                        title={career.isActive ? "Archive — hide from students" : "Publish — make visible to students"}
                        aria-label={career.isActive ? `Archive ${career.title}` : `Publish ${career.title}`}
                        className="disabled:pointer-events-none disabled:opacity-50"
                      >
                        <Badge variant={career.isActive ? "green" : "neutral"}>
                          {career.isActive ? "Active" : "Archived"}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-4 py-2.5 sm:px-6">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            setEditingCareer(career);
                            setFormOpen(true);
                          }}
                          title="Edit career"
                          aria-label={`Edit ${career.title}`}
                          className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(career)}
                          title="Delete career"
                          aria-label={`Delete ${career.title}`}
                          className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={data?.page ?? 1}
            totalPages={data?.totalPages ?? 1}
            onPageChange={setPage}
          />
        </Card>
      )}

      <CareerFormModal
        open={formOpen}
        career={editingCareer}
        onClose={() => {
          setFormOpen(false);
          setEditingCareer(null);
        }}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.title}"?`}
        description="This permanently removes the career from the platform. This action cannot be undone. If students have bookmarked it or have roadmap progress against it, this will be blocked — archive it instead in that case."
        loading={deleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  );
}
