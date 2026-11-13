import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Pencil, Route as RouteIcon } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import SEOHead from "@/components/common/SEOHead";
import { getAdminRoadmaps, deleteAdminRoadmap } from "@/services/admin";

export default function AdminRoadmapsPage() {
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "roadmaps", { page }],
    queryFn: () => getAdminRoadmaps({ page, limit: 10 }).then((res) => res.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminRoadmap,
    onSuccess: () => {
      toast.success("Roadmap deleted");
      queryClient.invalidateQueries({ queryKey: ["admin", "roadmaps"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      setDeleteTarget(null);
    },
    onError: () => toast.error("Couldn't delete roadmap."),
  });

  const roadmaps = data?.roadmaps ?? [];

  return (
    <div className="flex flex-col gap-6">
      <SEOHead title="Manage Roadmaps" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Console / Roadmaps
          </span>
          <h1 className="mt-1 font-display text-3xl text-slate-900 dark:text-slate-50">
            Roadmaps
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {data?.total ?? 0} roadmap{data?.total === 1 ? "" : "s"} published
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link to="/admin/careers">
              Careers Coverage
            </Link>
          </Button>
          <Button asChild variant="admin">
            <Link to="/admin/roadmaps/new">
              <Plus size={16} />
              New Roadmap
            </Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : roadmaps.length === 0 ? (
        <EmptyState
          icon={RouteIcon}
          title="No roadmaps yet"
          description="Create a phase-by-phase roadmap for a career to get started."
          action={
            <Button asChild variant="admin" size="sm">
              <Link to="/admin/roadmaps/new">New Roadmap</Link>
            </Button>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border font-mono text-[10.5px] uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-2.5 font-semibold sm:px-6">Roadmap</th>
                  <th className="px-4 py-2.5 font-semibold sm:px-6">Career</th>
                  <th className="px-4 py-2.5 font-semibold sm:px-6">Phases</th>
                  <th className="px-4 py-2.5 font-semibold sm:px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roadmaps.map((roadmap) => (
                  <tr key={roadmap.id} className="border-b border-border last:border-0">
                    <td className="max-w-48 truncate px-4 py-2.5 font-medium text-slate-900 dark:text-slate-50 sm:px-6">
                      {roadmap.title}
                    </td>
                    <td className="max-w-40 truncate px-4 py-2.5 text-slate-600 dark:text-slate-300 sm:px-6">
                      {roadmap.careerId?.title ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-600 dark:text-slate-300 sm:px-6">
                      {String(roadmap.phases?.length ?? 0).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-2.5 sm:px-6">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() =>
                            navigate(`/admin/roadmaps/${roadmap.id}/edit`, { state: { roadmap } })
                          }
                          className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50"
                          aria-label="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(roadmap)}
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

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.title}"?`}
        description="This removes the roadmap for this career. This action cannot be undone."
        loading={deleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  );
}
