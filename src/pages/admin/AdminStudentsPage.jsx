import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Trash2, Users } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import SEOHead from "@/components/common/SEOHead";
import { getAdminUsers, deleteAdminUser } from "@/services/admin";

const EDUCATION_LABELS = { class10: "Class 10", class12: "Class 12", graduation: "Graduation" };

export default function AdminStudentsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", { search, page }],
    queryFn: () =>
      getAdminUsers({ search: search || undefined, page, limit: 10 }).then((res) => res.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: () => {
      toast.success("Student removed");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      setDeleteTarget(null);
    },
    onError: () => toast.error("Couldn't remove this student."),
  });

  const users = data?.users ?? [];

  return (
    <div className="flex flex-col gap-6">
      <SEOHead title="Manage Students" />

      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-slate-50">
          Students
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {data?.total ?? 0} student{data?.total === 1 ? "" : "s"} registered
        </p>
      </div>

      <div className="relative max-w-sm">
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
          className="h-11 w-full rounded-lg border border-border bg-surface pl-10 pr-4 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students found"
          description={
            search
              ? "Try a different search term."
              : "Students will appear here once they register."
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  <th className="px-4 py-3 font-semibold sm:px-6">Name</th>
                  <th className="px-4 py-3 font-semibold sm:px-6">Education</th>
                  <th className="px-4 py-3 font-semibold sm:px-6">Stream</th>
                  <th className="px-4 py-3 font-semibold sm:px-6">Quiz</th>
                  <th className="px-4 py-3 font-semibold sm:px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((student) => (
                  <tr key={student.id} className="border-b border-border last:border-0">
                    <td className="max-w-40 px-4 py-3 sm:max-w-none sm:px-6">
                      <div className="truncate font-medium text-slate-900 dark:text-slate-50">
                        {student.fullName}
                      </div>
                      <div className="truncate text-xs text-slate-400 dark:text-slate-500">
                        {student.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 sm:px-6">
                      {EDUCATION_LABELS[student.educationLevel] ?? "—"}
                    </td>
                    <td className="px-4 py-3 capitalize text-slate-600 dark:text-slate-300 sm:px-6">
                      {student.stream ?? "—"}
                    </td>
                    <td className="px-4 py-3 sm:px-6">
                      <Badge variant={student.quizCompleted ? "primary" : "neutral"}>
                        {student.quizCompleted ? "Done" : "Pending"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 sm:px-6">
                      <button
                        onClick={() => setDeleteTarget(student)}
                        className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-red-50 hover:text-red-600"
                        aria-label="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
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

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Remove ${deleteTarget?.fullName}?`}
        description="This permanently deletes the student's account and progress. This action cannot be undone."
        loading={deleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  );
}
