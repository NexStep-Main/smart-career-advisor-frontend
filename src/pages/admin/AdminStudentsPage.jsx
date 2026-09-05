import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  X,
  Users,
  Eye,
  Ban,
  CheckCircle2,
  Trash2,
  Download,
  SlidersHorizontal,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
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
import { timeAgo, cn } from "@/lib/utils";

const STATUS_META = {
  // "Active" is the routine, expected state for most rows — a plain
  // semantic green, not the console's amber, which is reserved for things
  // that need attention.
  active: { label: "Active", variant: "green" },
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

const SORT_COLUMNS = [
  { key: "createdAt", label: "Joined" },
  { key: "lastLoginAt", label: "Last active" },
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

function SortHeader({ column, sortBy, sortOrder, onSort }) {
  const active = sortBy === column.key;
  const Icon = active ? (sortOrder === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <button
      onClick={() => onSort(column.key)}
      className={cn(
        "flex items-center gap-1 font-semibold hover:text-slate-700 dark:hover:text-slate-200",
        active && "text-slate-700 dark:text-slate-200",
      )}
    >
      {column.label}
      <Icon size={12} className={active ? "text-admin-accent" : "text-slate-300 dark:text-slate-600"} />
    </button>
  );
}

// Shared status/quiz/dates block, reused by both the desktop table cells and
// the mobile stacked card so the two layouts can't silently drift apart on
// what fields they show.
function StudentMetaRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-slate-400 dark:text-slate-500">{label}</span>
      <span className="text-slate-700 dark:text-slate-200">{children}</span>
    </div>
  );
}

function StudentActions({ student, onSuspend, onReactivate, onDelete, pending }) {
  return (
    <div className="flex gap-1.5">
      <Link
        to={`/admin/students/${student.id}`}
        title="View profile"
        aria-label={`View ${student.fullName}`}
        className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50"
      >
        <Eye size={15} />
      </Link>
      {student.status === "suspended" ? (
        <button
          onClick={onReactivate}
          disabled={pending}
          title="Reactivate account"
          aria-label={`Reactivate ${student.fullName}`}
          className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-admin-accent"
        >
          <CheckCircle2 size={15} />
        </button>
      ) : (
        <button
          onClick={onSuspend}
          disabled={pending || student.status === "deleted"}
          title="Suspend account"
          aria-label={`Suspend ${student.fullName}`}
          className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50 disabled:pointer-events-none disabled:opacity-40"
        >
          <Ban size={15} />
        </button>
      )}
      <button
        onClick={onDelete}
        disabled={student.status === "deleted"}
        title="Delete account"
        aria-label={`Delete ${student.fullName}`}
        className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:opacity-40"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

export default function AdminStudentsPage() {
  const [search, setSearch] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [stream, setStream] = useState("");
  const [status, setStatus] = useState("");
  const [profileCompletion, setProfileCompletion] = useState("");
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");
  const [includeTestAccounts, setIncludeTestAccounts] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(() => new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [bulkConfirm, setBulkConfirm] = useState(null); // "suspend" | null (reactivate needs no confirm)
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
    includeTestAccounts: includeTestAccounts || undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", { ...filters, sortBy, sortOrder, page }],
    queryFn: () =>
      getAdminUsers({ ...filters, sortBy, sortOrder, page, limit: 10 }).then((res) => res.data.data),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] });

  const statusMutation = useMutation({
    mutationFn: ({ id, status: next }) => updateAdminUserStatus(id, next),
    onSuccess: (_res, { status: next }) => {
      toast.success(next === "deleted" ? "Student moved to trash" : `Student ${next}`);
      invalidate();
      setDeleteTarget(null);
      setSuspendTarget(null);
    },
    onError: () => toast.error("Couldn't update this student's status."),
  });

  const bulkMutation = useMutation({
    mutationFn: ({ ids, status: next }) => bulkUpdateAdminUserStatus(ids, next),
    onSuccess: (res) => {
      toast.success(res.data.message);
      setSelected(new Set());
      setBulkConfirm(null);
      invalidate();
    },
    onError: () => toast.error("Couldn't update the selected students."),
  });

  const users = data?.users ?? [];
  const activeFilterCount = [
    educationLevel,
    stream,
    status,
    profileCompletion,
    createdFrom,
    createdTo,
    includeTestAccounts,
  ].filter(Boolean).length;
  const hasFilters = !!search || activeFilterCount > 0;

  const clearFilters = () => {
    setSearch("");
    setEducationLevel("");
    setStream("");
    setStatus("");
    setProfileCompletion("");
    setCreatedFrom("");
    setCreatedTo("");
    setIncludeTestAccounts(false);
    setPage(1);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
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

  const selectedStudents = users.filter((u) => selected.has(u.id));

  return (
    <div className="flex flex-col gap-6">
      <SEOHead title="Manage Students" />

      {import.meta.env.DEV && (
        <div className="rounded-lg border border-dashed border-admin-accent/40 bg-admin-accent-light px-4 py-2 font-mono text-xs text-admin-accent-dark">
          Development environment — test accounts may be present. Use "Include test accounts" to
          reveal them, or mark them from a student's Edit form.
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Console / Students
          </span>
          <h1 className="mt-1 font-display text-3xl text-slate-900 dark:text-slate-50">
            Students
          </h1>
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

          {/* Filters stay inline from lg up; below that they're a toggleable
              panel so 5 selects + a date range don't get crushed. */}
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

        <div className={cn("flex-col gap-3 lg:flex", filtersOpen ? "flex" : "hidden lg:flex")}>
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

          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={includeTestAccounts}
              onChange={(e) => {
                setIncludeTestAccounts(e.target.checked);
                setPage(1);
              }}
              className="size-4 rounded border-border"
            />
            Include test accounts
          </label>

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
              onClick={() => setBulkConfirm("suspend")}
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
        <>
          {/* Desktop/tablet — table. Hidden below sm, where 8 columns can't
              fit without horizontal scroll. */}
          <Card className="hidden overflow-hidden sm:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border font-mono text-[10.5px] uppercase tracking-wide text-slate-500">
                    <th className="w-10 px-4 py-2.5 sm:px-6">
                      <input
                        type="checkbox"
                        checked={selected.size === users.length}
                        onChange={toggleSelectAll}
                        className="size-4 rounded border-border"
                        aria-label="Select all"
                      />
                    </th>
                    <th className="px-4 py-2.5 font-semibold sm:px-6">Name</th>
                    <th className="px-4 py-2.5 font-semibold sm:px-6">Education</th>
                    <th className="px-4 py-2.5 font-semibold sm:px-6">Stream</th>
                    <th className="px-4 py-2.5 font-semibold sm:px-6">Quiz</th>
                    <th className="px-4 py-2.5 font-semibold sm:px-6">Status</th>
                    {SORT_COLUMNS.map((col) => (
                      <th key={col.key} className="px-4 py-2.5 sm:px-6">
                        <SortHeader column={col} sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                      </th>
                    ))}
                    <th className="px-4 py-2.5 font-semibold sm:px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((student) => {
                    const meta = STATUS_META[student.status] ?? STATUS_META.active;
                    return (
                      <tr key={student.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-2.5 sm:px-6">
                          <input
                            type="checkbox"
                            checked={selected.has(student.id)}
                            onChange={() => toggleSelected(student.id)}
                            className="size-4 rounded border-border"
                            aria-label={`Select ${student.fullName}`}
                          />
                        </td>
                        <td className="max-w-48 px-4 py-2.5 sm:px-6">
                          <div className="flex items-center gap-1.5">
                            <Link
                              to={`/admin/students/${student.id}`}
                              className="block truncate font-medium text-slate-900 hover:text-admin-accent dark:text-slate-50"
                            >
                              {student.fullName}
                            </Link>
                            {student.isTestAccount && (
                              <Badge variant="orange" className="shrink-0">
                                Test
                              </Badge>
                            )}
                          </div>
                          <div className="truncate font-mono text-xs text-slate-500 dark:text-slate-500">
                            {student.email}
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300 sm:px-6">
                          {student.educationLevel
                            ? EDUCATION_LEVELS.find((l) => l.value === student.educationLevel)
                                ?.label
                            : "—"}
                        </td>
                        <td className="px-4 py-2.5 capitalize text-slate-600 dark:text-slate-300 sm:px-6">
                          {student.stream ?? "—"}
                        </td>
                        <td className="px-4 py-2.5 sm:px-6">
                          <Badge variant={student.quizCompleted ? "green" : "neutral"}>
                            {student.quizCompleted ? "Done" : "Pending"}
                          </Badge>
                        </td>
                        <td className="px-4 py-2.5 sm:px-6">
                          <Badge variant={meta.variant}>{meta.label}</Badge>
                        </td>
                        <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-slate-500 dark:text-slate-400 sm:px-6">
                          {timeAgo(student.createdAt)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-slate-500 dark:text-slate-400 sm:px-6">
                          {student.lastLoginAt ? timeAgo(student.lastLoginAt) : "Never"}
                        </td>
                        <td className="px-4 py-2.5 sm:px-6">
                          <StudentActions
                            student={student}
                            pending={statusMutation.isPending}
                            onSuspend={() => setSuspendTarget(student)}
                            onReactivate={() =>
                              statusMutation.mutate({ id: student.id, status: "active" })
                            }
                            onDelete={() => setDeleteTarget(student)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination page={data?.page ?? 1} totalPages={data?.totalPages ?? 1} onPageChange={setPage} />
          </Card>

          {/* Mobile — stacked cards instead of a cramped/scrolling table. */}
          <div className="flex flex-col gap-3 sm:hidden">
            {users.map((student) => {
              const meta = STATUS_META[student.status] ?? STATUS_META.active;
              return (
                <Card key={student.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <label className="flex min-w-0 items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selected.has(student.id)}
                        onChange={() => toggleSelected(student.id)}
                        className="mt-1 size-4 shrink-0 rounded border-border"
                        aria-label={`Select ${student.fullName}`}
                      />
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5">
                          <Link
                            to={`/admin/students/${student.id}`}
                            className="truncate font-medium text-slate-900 dark:text-slate-50"
                          >
                            {student.fullName}
                          </Link>
                          {student.isTestAccount && <Badge variant="orange">Test</Badge>}
                        </span>
                        <span className="block truncate font-mono text-xs text-slate-500">
                          {student.email}
                        </span>
                      </span>
                    </label>
                    <Badge variant={meta.variant} className="shrink-0">
                      {meta.label}
                    </Badge>
                  </div>

                  <div className="mt-3 flex flex-col gap-1.5 border-t border-border pt-3">
                    <StudentMetaRow label="Education">
                      {student.educationLevel
                        ? EDUCATION_LEVELS.find((l) => l.value === student.educationLevel)?.label
                        : "—"}
                    </StudentMetaRow>
                    <StudentMetaRow label="Stream">
                      <span className="capitalize">{student.stream ?? "—"}</span>
                    </StudentMetaRow>
                    <StudentMetaRow label="Quiz">
                      <Badge variant={student.quizCompleted ? "accent" : "neutral"}>
                        {student.quizCompleted ? "Done" : "Pending"}
                      </Badge>
                    </StudentMetaRow>
                    <StudentMetaRow label="Joined">
                      <span className="font-mono text-xs">{timeAgo(student.createdAt)}</span>
                    </StudentMetaRow>
                    <StudentMetaRow label="Last active">
                      <span className="font-mono text-xs">
                        {student.lastLoginAt ? timeAgo(student.lastLoginAt) : "Never"}
                      </span>
                    </StudentMetaRow>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <StudentActions
                      student={student}
                      pending={statusMutation.isPending}
                      onSuspend={() => setSuspendTarget(student)}
                      onReactivate={() =>
                        statusMutation.mutate({ id: student.id, status: "active" })
                      }
                      onDelete={() => setDeleteTarget(student)}
                    />
                  </div>
                </Card>
              );
            })}
            <Card className="overflow-hidden">
              <Pagination page={data?.page ?? 1} totalPages={data?.totalPages ?? 1} onPageChange={setPage} />
            </Card>
          </div>
        </>
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

      <ConfirmDialog
        open={!!suspendTarget}
        title={`Suspend ${suspendTarget?.fullName}?`}
        description="They'll be logged out immediately and won't be able to log back in until reactivated."
        confirmLabel="Suspend"
        loading={statusMutation.isPending}
        onCancel={() => setSuspendTarget(null)}
        onConfirm={() => statusMutation.mutate({ id: suspendTarget.id, status: "suspended" })}
      />

      <ConfirmDialog
        open={bulkConfirm === "suspend"}
        title={`Suspend ${selectedStudents.length} student${selectedStudents.length === 1 ? "" : "s"}?`}
        description={
          selectedStudents.length <= 5
            ? `${selectedStudents.map((s) => s.fullName).join(", ")} will be logged out immediately and won't be able to log back in until reactivated.`
            : "They'll be logged out immediately and won't be able to log back in until reactivated."
        }
        confirmLabel="Suspend"
        loading={bulkMutation.isPending}
        onCancel={() => setBulkConfirm(null)}
        onConfirm={() => bulkMutation.mutate({ ids: [...selected], status: "suspended" })}
      />
    </div>
  );
}
