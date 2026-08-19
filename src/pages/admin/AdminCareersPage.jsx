import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Pencil, Trash2, Briefcase } from "lucide-react";
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

const DEMAND_VARIANT = { high: "green", medium: "orange", low: "neutral" };

export default function AdminCareersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "careers", { search, page }],
    queryFn: () =>
      getAdminCareers({ search: search || undefined, page, limit: 10 }).then(
        (res) => res.data.data,
      ),
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

  const deleteMutation = useMutation({
    mutationFn: deleteCareer,
    onSuccess: () => {
      toast.success("Career deleted");
      invalidate();
      setDeleteTarget(null);
    },
    onError: () => toast.error("Couldn't delete career."),
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

  const careers = data?.careers ?? [];

  return (
    <div className="flex flex-col gap-6">
      <SEOHead title="Manage Careers" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-slate-50">
            Manage Careers
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {data?.total ?? 0} career{data?.total === 1 ? "" : "s"} on the platform
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCareer(null);
            setFormOpen(true);
          }}
        >
          <Plus size={16} />
          Add Career
        </Button>
      </div>

      <div className="relative max-w-sm">
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
          className="h-11 w-full rounded-lg border border-border bg-surface pl-10 pr-4 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
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
            search ? "Try a different search term." : "Add your first career to get started."
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  <th className="px-4 py-3 font-semibold sm:px-6">Career</th>
                  <th className="px-4 py-3 font-semibold sm:px-6">Domain</th>
                  <th className="px-4 py-3 font-semibold sm:px-6">Demand</th>
                  <th className="px-4 py-3 font-semibold sm:px-6">Salary</th>
                  <th className="px-4 py-3 font-semibold sm:px-6">Status</th>
                  <th className="px-4 py-3 font-semibold sm:px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {careers.map((career) => (
                  <tr key={career.id} className="border-b border-border last:border-0">
                    <td className="max-w-55 px-4 py-3 sm:px-6">
                      <div className="truncate font-medium text-slate-900 dark:text-slate-50">
                        {career.title}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 sm:px-6">
                      {career.domain}
                    </td>
                    <td className="px-4 py-3 sm:px-6">
                      <Badge variant={DEMAND_VARIANT[career.demandLevel] ?? "neutral"}>
                        {career.demandLevel}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-300 sm:px-6">
                      {career.salaryRange}
                    </td>
                    <td className="px-4 py-3 sm:px-6">
                      <button
                        onClick={() => toggleStatus(career)}
                        disabled={updateMutation.isPending}
                        className={
                          career.isActive
                            ? "rounded-lg bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary-dark"
                            : "rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400"
                        }
                      >
                        {career.isActive ? "Active" : "Draft"}
                      </button>
                    </td>
                    <td className="px-4 py-3 sm:px-6">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            setEditingCareer(career);
                            setFormOpen(true);
                          }}
                          className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50"
                          aria-label="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(career)}
                          className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-red-50 hover:text-red-600"
                          aria-label="Delete"
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
        description="This will permanently remove the career from the platform. This action cannot be undone."
        loading={deleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  );
}
