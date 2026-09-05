import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import FormError from "@/components/ui/FormError";
import { updateAdminSchema } from "@/utils/schemas";

/**
 * Superadmin-only "edit an admin account" form, from /admin/admins. Mirrors
 * CreateAdminModal but pre-fills the existing values and every field is
 * optional (partial update) — a superadmin might only be fixing a typo.
 */
export default function EditAdminModal({ open, admin, onClose, onSubmit, isSubmitting }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(updateAdminSchema) });

  useEffect(() => {
    if (admin) {
      reset({ fullName: admin.fullName, username: admin.username, email: admin.email });
    }
  }, [admin, reset]);

  if (!open || !admin) return null;

  const submit = async (values) => {
    try {
      await onSubmit(values);
    } catch (error) {
      const fieldErrors = error.response?.data?.error?.fieldErrors;
      if (fieldErrors) {
        for (const [field, messages] of Object.entries(fieldErrors)) {
          if (messages?.[0]) setError(field, { type: "server", message: messages[0] });
        }
      }
      // Non-field errors (network, generic 500s) surface as a toast — the
      // caller's mutation onError handles that; nothing else to do here.
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 py-8 sm:items-center">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface shadow-lg">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-display text-lg text-slate-900 dark:text-slate-50">
            Edit {admin.fullName}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-4 px-6 py-5">
          <div>
            <Label htmlFor="edit-fullName">Full name</Label>
            <Input id="edit-fullName" error={!!errors.fullName} {...register("fullName")} />
            <FormError message={errors.fullName?.message} />
          </div>

          <div>
            <Label htmlFor="edit-username">Username</Label>
            <Input
              id="edit-username"
              autoComplete="username"
              error={!!errors.username}
              {...register("username")}
            />
            <FormError message={errors.username?.message} />
          </div>

          <div>
            <Label htmlFor="edit-email">Email</Label>
            <Input id="edit-email" type="email" error={!!errors.email} {...register("email")} />
            <FormError message={errors.email?.message} />
          </div>

          <FormError message={errors.root?.message} />
        </form>

        <div className="flex gap-3 border-t border-border px-6 py-4">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="admin"
            className="flex-1"
            onClick={handleSubmit(submit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
