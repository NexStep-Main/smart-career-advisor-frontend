import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, X, Users, Eye, Ban, CheckCircle2, Trash2, Download } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import SEOHead from "@/components/common/SEOHead";
import {
  getAdminUsers,
  updateAdminUserStatus,
  bulkUpdateAdminUserStatus,
  exportAdminUsers,
} from "@/services/admin";
import { EDUCATION_LEVELS, STREAMS } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";

const STATUS_META = {
  active: { label: "Active", variant: "accent" },
  suspended: { label: "Suspended", variant: "orange" },
  deleted: { label: "Deleted", variant: "danger" },
};

const STATUS_FILTERS = [
  { value: "", label: "Active + suspended" },
  { value: "active", label: "Active only" },
  { value: "suspended", label: "Suspended only" },
  { value: "deleted", label: "Deleted" },
  { value: "all", label: "All statuses" },
];

const COMPLETION_FILTERS = [
  { value: "", label: "Any completion" },
  { value: "complete", label: "Complete" },
  { value: "incomplete", label: "Incomplete" },
];

const selectClass =
  "h-11 min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 text-sm text-slate-700 dark:text-slate-200 focus:border-primary focus:outline-none sm:flex-none";

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function AdminStudentsPage() {
  const [search, setSearch] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [stream, setStream] = useState("");
  const [status, setStatus] = useState("");
  const [profileCompletion, setProfileCompletion] = useState("");
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(() => new Set());
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [exporting, setExporting] = useState(false);

  const queryClient = useQueryClient();

  const filters = {
    search: search || undefined,
    educationLevel: educationLevel || undefined,
    stream: stream || undefined,
    status: status || undefined,
    profileCompletion: profileCompletion || undefined,
    createdFrom: createdFrom || undefined,
    createdTo: createdTo || undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", { ...filters, page }],
    queryFn: () => getAdminUsers({ ...filters, page, limit: 10 }).then((res) => res.data.data),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] });

  const statusMutation = useMutation({
    mutationFn: ({ id, status: next }) => updateAdminUserStatus(id, next),
    onSuccess: (_res, { status: next }) => {
      toast.success(next === "deleted" ? "Student moved to trash" : `Student ${next}`);
      invalidate();
      setDeleteTarget(null);
    },
    onError: () => toast.error("Couldn't update this student's status."),
  });

  const bulkMutation = useMutation({
    mutationFn: ({ ids, status: next }) => bulkUpdateAdminUserStatus(ids, next),
    onSuccess: (res) => {
      toast.success(res.data.message);
      setSelected(new Set());
      invalidate();
    },
    onError: () => toast.error("Couldn't update the selected students."),
  });

  const users = data?.users ?? [];
  const hasFilters =
    search || educationLevel || stream || status || profileCompletion || createdFrom || createdTo;

  const clearFilters = () => {
    setSearch("");
    setEducationLevel("");
    setStream("");
    setStatus("");
    setProfileCompletion("");
    setCreatedFrom("");
    setCreatedTo("");
    setPage(1);
  };

  const toggleSelected = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected((prev) => (prev.size === users.length ? new Set() : new Set(users.map((u) => u.id))));
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await exportAdminUsers(filters);
      downloadBlob(res.data, `students-${new Date().toISOString().slice(0, 10)}.csv`);
    } catch {
      toast.error("Couldn't export students.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <SEOHead title="Manage Students" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-slate-900 dark:text-slate-50">Students</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {data?.total ?? 0} student{data?.total === 1 ? "" : "s"} matching current filters
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting}>
          <Download size={14} />
          {exporting ? "Exporting…" : "Export CSV"}
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
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex shrink-0 items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-red-500"
            >
              <X size={13} />
              Clear filters
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={educationLevel}
            onChange={(e) => {
              setEducationLevel(e.target.value);
              setPage(1);
            }}
            className={selectClass}
          >
            <option value="">All education levels</option>
            {EDUCATION_LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
          <select
            value={stream}
            onChange={(e) => {
              setStream(e.target.value);
              setPage(1);
            }}
            className={selectClass}
          >
            <option value="">All streams</option>
            {STREAMS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
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
          <select
            value={profileCompletion}
            onChange={(e) => {
              setProfileCompletion(e.target.value);
              setPage(1);
            }}
            className={selectClass}
          >
            {COMPLETION_FILTERS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={createdFrom}
              onChange={(e) => {
                setCreatedFrom(e.target.value);
                setPage(1);
              }}
              aria-label="Signed up from"
              className="h-11 rounded-lg border border-border bg-surface px-3 text-sm text-slate-700 dark:text-slate-200 focus:border-primary focus:outline-none"
            />
            <span className="text-xs text-slate-400 dark:text-slate-500">to</span>
            <input
              type="date"
              value={createdTo}
              onChange={(e) => {
                setCreatedTo(e.target.value);
                setPage(1);
              }}
              aria-label="Signed up to"
              className="h-11 rounded-lg border border-border bg-surface px-3 text-sm text-slate-700 dark:text-slate-200 focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-admin-accent/30 bg-admin-accent-light px-4 py-3">
          <span className="text-sm font-medium text-admin-accent-dark">
            {selected.size} selected
          </span>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={bulkMutation.isPending}
              onClick={() => bulkMutation.mutate({ ids: [...selected], status: "active" })}
            >
              <CheckCircle2 size={14} />
              Reactivate
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={bulkMutation.isPending}
              onClick={() => bulkMutation.mutate({ ids: [...selected], status: "suspended" })}
            >
              <Ban size={14} />
              Suspend
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
              Clear selection
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title={hasFilters ? "No students found" : "No students yet"}
          description={
            hasFilters
              ? "Try different filters or clear them to see everyone."
              : "Students will appear here once they register."
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
                <tr className="border-b border-border text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  <th className="w-10 px-4 py-3 sm:px-6">
                    <input
                      type="checkbox"
                      checked={selected.size === users.length}
                      onChange={toggleSelectAll}
                      className="size-4 rounded border-border"
                      aria-label="Select all"
                    />
                  </th>
                  <th className="px-4 py-3 font-semibold sm:px-6">Name</th>
                  <th className="px-4 py-3 font-semibold sm:px-6">Education</th>
                  <th className="px-4 py-3 font-semibold sm:px-6">Stream</th>
                  <th className="px-4 py-3 font-semibold sm:px-6">Quiz</th>
                  <th className="px-4 py-3 font-semibold sm:px-6">Status</th>
                  <th className="px-4 py-3 font-semibold sm:px-6">Joined</th>
                  <th className="px-4 py-3 font-semibold sm:px-6">Last active</th>
                  <th className="px-4 py-3 font-semibold sm:px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((student) => {
                  const meta = STATUS_META[student.status] ?? STATUS_META.active;
                  return (
                    <tr key={student.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 sm:px-6">
                        <input
                          type="checkbox"
                          checked={selected.has(student.id)}
                          onChange={() => toggleSelected(student.id)}
                          className="size-4 rounded border-border"
                          aria-label={`Select ${student.fullName}`}
                        />
                      </td>
                      <td className="max-w-48 px-4 py-3 sm:px-6">
                        <Link
                          to={`/admin/students/${student.id}`}
                          className="block truncate font-medium text-slate-900 hover:text-admin-accent dark:text-slate-50"
                        >
                          {student.fullName}
                        </Link>
                        <div className="truncate text-xs text-slate-400 dark:text-slate-500">
                          {student.email}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 sm:px-6">
                        {student.educationLevel
                          ? EDUCATION_LEVELS.find((l) => l.value === student.educationLevel)
                              ?.label
                          : "—"}
                      </td>
                      <td className="px-4 py-3 capitalize text-slate-600 dark:text-slate-300 sm:px-6">
                        {student.stream ?? "—"}
                      </td>
                      <td className="px-4 py-3 sm:px-6">
                        <Badge variant={student.quizCompleted ? "accent" : "neutral"}>
                          {student.quizCompleted ? "Done" : "Pending"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 sm:px-6">
                        <Badge variant={meta.variant}>{meta.label}</Badge>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-500 dark:text-slate-400 sm:px-6">
                        {timeAgo(student.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-500 dark:text-slate-400 sm:px-6">
                        {student.lastLoginAt ? timeAgo(student.lastLoginAt) : "Never"}
                      </td>
                      <td className="px-4 py-3 sm:px-6">
                        <div className="flex gap-1.5">
                          <Link
                            to={`/admin/students/${student.id}`}
                            className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50"
                            aria-label="View"
                          >
                            <Eye size={15} />
                          </Link>
                          {student.status === "suspended" ? (
                            <button
                              onClick={() =>
                                statusMutation.mutate({ id: student.id, status: "active" })
                              }
                              disabled={statusMutation.isPending}
                              className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-admin-accent"
                              aria-label="Reactivate"
                            >
                              <CheckCircle2 size={15} />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                statusMutation.mutate({ id: student.id, status: "suspended" })
                              }
                              disabled={statusMutation.isPending || student.status === "deleted"}
                              className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50 disabled:pointer-events-none disabled:opacity-40"
                              aria-label="Suspend"
                            >
                              <Ban size={15} />
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteTarget(student)}
                            disabled={student.status === "deleted"}
                            className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:opacity-40"
                            aria-label="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination page={data?.page ?? 1} totalPages={data?.totalPages ?? 1} onPageChange={setPage} />
        </Card>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete ${deleteTarget?.fullName}?`}
        description="This is reversible — the account is hidden from the platform but not erased. You can restore it from the Deleted filter."
        confirmLabel="Delete"
        loading={statusMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => statusMutation.mutate({ id: deleteTarget.id, status: "deleted" })}
      />
    </div>
  );
}
