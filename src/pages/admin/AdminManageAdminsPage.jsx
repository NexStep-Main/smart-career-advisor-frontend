import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import SEOHead from "@/components/common/SEOHead";
import CreateAdminModal from "@/components/admin/CreateAdminModal";
import { getAdminAdmins, createAdminUser } from "@/services/admin";
import { timeAgo } from "@/lib/utils";
import useAuthStore from "@/store/useAuthStore";

const ROLE_META = {
  superadmin: { label: "Superadmin", variant: "accent" },
  admin: { label: "Admin", variant: "neutral" },
};

export default function AdminManageAdminsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const currentUser = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "admins"],
    queryFn: () => getAdminAdmins().then((res) => res.data.data.admins),
  });

  const createMutation = useMutation({
    mutationFn: createAdminUser,
    onSuccess: () => {
      toast.success("Admin account created");
      queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
      setCreateOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Couldn't create this admin account.");
    },
  });

  const admins = data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <SEOHead title="Manage Admins" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Console / Admins
          </span>
          <h1 className="mt-1 font-display text-3xl text-slate-900 dark:text-slate-50">Admins</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {admins.length} admin account{admins.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button variant="admin" onClick={() => setCreateOpen(true)}>
          <Plus size={16} />
          Create admin
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : admins.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="No admin accounts" description="This shouldn't be possible — you're logged in as one." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border font-mono text-[10.5px] uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-2.5 font-semibold sm:px-6">Name</th>
                  <th className="px-4 py-2.5 font-semibold sm:px-6">Username</th>
                  <th className="px-4 py-2.5 font-semibold sm:px-6">Email</th>
                  <th className="px-4 py-2.5 font-semibold sm:px-6">Role</th>
                  <th className="px-4 py-2.5 font-semibold sm:px-6">Last active</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => {
                  const meta = ROLE_META[admin.role] ?? ROLE_META.admin;
                  return (
                    <tr key={admin.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-2.5 sm:px-6">
                        <div className="font-medium text-slate-900 dark:text-slate-50">
                          {admin.fullName}
                          {admin.id === currentUser?.id && (
                            <span className="ml-2 text-xs font-normal text-slate-400 dark:text-slate-500">
                              (you)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs text-slate-600 dark:text-slate-300 sm:px-6">
                        {admin.username}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs text-slate-600 dark:text-slate-300 sm:px-6">
                        {admin.email}
                      </td>
                      <td className="px-4 py-2.5 sm:px-6">
                        <Badge variant={meta.variant}>{meta.label}</Badge>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-slate-500 dark:text-slate-400 sm:px-6">
                        {admin.lastLoginAt ? timeAgo(admin.lastLoginAt) : "Never"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <CreateAdminModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(payload) => createMutation.mutateAsync(payload)}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
}
