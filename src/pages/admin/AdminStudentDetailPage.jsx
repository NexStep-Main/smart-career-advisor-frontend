import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Pencil,
  RotateCcw,
  Ban,
  CheckCircle2,
  Trash2,
  Bookmark,
  Route as RouteIcon,
  ClipboardList,
} from "lucide-react";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import SEOHead from "@/components/common/SEOHead";
import StudentEditModal from "@/components/admin/StudentEditModal";
import {
  getAdminUser,
  updateAdminUser,
  updateAdminUserStatus,
  resetAdminUserQuiz,
  deleteAdminUser,
} from "@/services/admin";
import { EDUCATION_LEVELS, STREAMS } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";

const EDUCATION_LABELS = Object.fromEntries(EDUCATION_LEVELS.map((l) => [l.value, l.label]));
const STREAM_LABELS = Object.fromEntries(STREAMS.map((s) => [s.value, s.label]));

const STATUS_META = {
  active: { label: "Active", variant: "accent" },
  suspended: { label: "Suspended", variant: "orange" },
  deleted: { label: "Deleted", variant: "danger" },
};

function formatQuizAnswer(value) {
  if (Array.isArray(value)) return value.join(", ") || "—";
  if (value == null || value === "") return "—";
  return String(value);
}

export default function AdminStudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [editOpen, setEditOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // "suspend" | "reactivate" | "delete" | "purge"

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "user", id],
    queryFn: () => getAdminUser(id).then((res) => res.data.data),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "user", id] });
    queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
  };

  const editMutation = useMutation({
    mutationFn: (payload) => updateAdminUser(id, payload),
    onSuccess: () => {
      toast.success("Student updated");
      invalidate();
      setEditOpen(false);
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status) => updateAdminUserStatus(id, status),
    onSuccess: (_res, status) => {
      toast.success(status === "deleted" ? "Student moved to trash" : `Student ${status}`);
      invalidate();
      setConfirmAction(null);
    },
    onError: () => toast.error("Couldn't update this student's status."),
  });

  const resetQuizMutation = useMutation({
    mutationFn: () => resetAdminUserQuiz(id),
    onSuccess: () => {
      toast.success("Quiz reset — student can retake it");
      invalidate();
    },
    onError: () => toast.error("Couldn't reset this student's quiz."),
  });

  const purgeMutation = useMutation({
    mutationFn: () => deleteAdminUser(id),
    onSuccess: () => {
      toast.success("Student permanently deleted");
      navigate("/admin/students", { replace: true });
    },
    onError: () => toast.error("Couldn't permanently delete this student."),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (isError || !data?.user) {
    return (
      <EmptyState
        title="Student not found"
        description="This student doesn't exist or was removed."
        action={
          <Button asChild size="sm" variant="admin">
            <Link to="/admin/students">Back to students</Link>
          </Button>
        }
      />
    );
  }

  const { user, bookmarks, roadmapProgress } = data;
  const status = STATUS_META[user.status] ?? STATUS_META.active;
  const quizEntries = Object.entries(user.quizAnswers ?? {});

  return (
    <div className="flex flex-col gap-6">
      <SEOHead title={user.fullName} />

      <button
        onClick={() => navigate("/admin/students")}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
      >
        <ArrowLeft size={15} />
        Back to students
      </button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl text-slate-900 dark:text-slate-50">
              {user.fullName}
            </h1>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil size={14} />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => resetQuizMutation.mutate()}
            disabled={resetQuizMutation.isPending}
          >
            <RotateCcw size={14} />
            Reset quiz
          </Button>
          {user.status === "suspended" ? (
            <Button
              variant="admin"
              size="sm"
              onClick={() => setConfirmAction("reactivate")}
              disabled={statusMutation.isPending}
            >
              <CheckCircle2 size={14} />
              Reactivate
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmAction("suspend")}
              disabled={statusMutation.isPending || user.status === "deleted"}
            >
              <Ban size={14} />
              Suspend
            </Button>
          )}
          {user.status !== "deleted" ? (
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 hover:text-red-600"
              onClick={() => setConfirmAction("delete")}
            >
              <Trash2 size={14} />
              Delete
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20"
              onClick={() => setConfirmAction("purge")}
            >
              <Trash2 size={14} />
              Delete permanently
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col gap-3">
            <h2 className="font-display text-lg text-slate-900 dark:text-slate-50">Profile</h2>
            <dl className="flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500 dark:text-slate-400">Education level</dt>
                <dd className="text-slate-800 dark:text-slate-100">
                  {EDUCATION_LABELS[user.educationLevel] ?? "Not set"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500 dark:text-slate-400">Stream</dt>
                <dd className="text-slate-800 dark:text-slate-100">
                  {STREAM_LABELS[user.stream] ?? "Not set"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500 dark:text-slate-400">Quiz</dt>
                <dd className="text-slate-800 dark:text-slate-100">
                  {user.quizCompleted ? "Completed" : "Not taken"}
                </dd>
              </div>
              <div className="flex justify-between gap-3 border-t border-border pt-2.5">
                <dt className="text-slate-500 dark:text-slate-400">Joined</dt>
                <dd className="text-slate-800 dark:text-slate-100">{timeAgo(user.createdAt)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500 dark:text-slate-400">Last active</dt>
                <dd className="text-slate-800 dark:text-slate-100">
                  {user.lastLoginAt ? timeAgo(user.lastLoginAt) : "Never logged in"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <ClipboardList size={16} className="text-admin-accent" />
              <h2 className="font-display text-lg text-slate-900 dark:text-slate-50">
                Quiz results
              </h2>
            </div>
            {quizEntries.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {user.quizCompleted
                  ? "Quiz completed, but no answers were recorded."
                  : "This student hasn't taken the quiz yet."}
              </p>
            ) : (
              <dl className="grid grid-cols-1 gap-x-6 gap-y-2.5 text-sm sm:grid-cols-2">
                {quizEntries.map(([question, answer]) => (
                  <div key={question} className="flex flex-col gap-0.5">
                    <dt className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      {question}
                    </dt>
                    <dd className="text-slate-800 dark:text-slate-100">
                      {formatQuizAnswer(answer)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Bookmark size={16} className="text-admin-accent" />
            <h2 className="font-display text-lg text-slate-900 dark:text-slate-50">
              Saved careers
            </h2>
          </div>
          {bookmarks.length === 0 ? (
            <EmptyState title="No saved careers" description="Nothing bookmarked yet." />
          ) : (
            <Card className="overflow-hidden">
              <div className="flex flex-col">
                {bookmarks.map((b) => (
                  <div
                    key={b.careerId?.id ?? b.careerId}
                    className="flex items-center justify-between gap-3 border-b border-border px-5 py-3 last:border-0"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-slate-900 dark:text-slate-50">
                        {b.careerId?.title ?? "Deleted career"}
                      </div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">
                        {b.careerId?.domain ?? "—"}
                      </div>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-slate-400 dark:text-slate-500">
                      {timeAgo(b.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </section>

        <section>
          <div className="mb-3 flex items-center gap-2">
            <RouteIcon size={16} className="text-admin-accent" />
            <h2 className="font-display text-lg text-slate-900 dark:text-slate-50">
              Roadmap progress
            </h2>
          </div>
          {roadmapProgress.length === 0 ? (
            <EmptyState title="No roadmaps started" description="Nothing in progress yet." />
          ) : (
            <Card className="overflow-hidden">
              <div className="flex flex-col">
                {roadmapProgress.map((rp) => {
                  const percent = rp.totalPhases
                    ? Math.round((rp.completedPhases.length / rp.totalPhases) * 100)
                    : 0;
                  return (
                    <div
                      key={rp.careerId?.id ?? rp.careerId}
                      className="flex items-center justify-between gap-3 border-b border-border px-5 py-3 last:border-0"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-slate-900 dark:text-slate-50">
                          {rp.careerId?.title ?? "Deleted career"}
                        </div>
                        <div className="text-xs text-slate-400 dark:text-slate-500">
                          {rp.completedPhases.length}/{rp.totalPhases ?? "?"} phases
                        </div>
                      </div>
                      <span className="shrink-0 font-mono text-xs text-admin-accent">
                        {percent}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </section>
      </div>

      <StudentEditModal
        open={editOpen}
        student={user}
        onClose={() => setEditOpen(false)}
        onSubmit={(values) => editMutation.mutateAsync(values)}
        isSubmitting={editMutation.isPending}
      />

      <ConfirmDialog
        open={confirmAction === "suspend"}
        title="Suspend this student?"
        description="They'll be logged out immediately and won't be able to log back in until reactivated."
        confirmLabel="Suspend"
        loading={statusMutation.isPending}
        onCancel={() => setConfirmAction(null)}
        onConfirm={() => statusMutation.mutate("suspended")}
      />
      <ConfirmDialog
        open={confirmAction === "reactivate"}
        title="Reactivate this student?"
        description="They'll be able to log in again immediately."
        confirmLabel="Reactivate"
        loading={statusMutation.isPending}
        onCancel={() => setConfirmAction(null)}
        onConfirm={() => statusMutation.mutate("active")}
      />
      <ConfirmDialog
        open={confirmAction === "delete"}
        title="Delete this student?"
        description="This is reversible — the account is hidden from the platform but not erased. You can restore it from the Deleted filter."
        confirmLabel="Delete"
        loading={statusMutation.isPending}
        onCancel={() => setConfirmAction(null)}
        onConfirm={() => statusMutation.mutate("deleted")}
      />
      <ConfirmDialog
        key={confirmAction === "purge"}
        open={confirmAction === "purge"}
        title="Permanently delete this student?"
        description="This cannot be undone. Their account, saved careers, and roadmap progress are erased for good."
        confirmLabel="Delete permanently"
        requireText={user.email}
        loading={purgeMutation.isPending}
        onCancel={() => setConfirmAction(null)}
        onConfirm={() => purgeMutation.mutate()}
      />
    </div>
  );
}
