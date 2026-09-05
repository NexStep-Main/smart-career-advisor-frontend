import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import FormError from "@/components/ui/FormError";
import { createAdminSchema } from "@/utils/schemas";

/**
 * Superadmin-only "invite another admin" form, from /admin/admins. No
 * password field — the invitee sets their own via an emailed link, so a
 * superadmin never has to choose or transmit someone else's credentials.
 */
export default function CreateAdminModal({ open, onClose, onSubmit, isSubmitting }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(createAdminSchema) });

  if (!open) return null;

  const submit = async (values) => {
    try {
      const { fullName, username, email } = values;
      await onSubmit({ fullName, username, email });
      reset();
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
            Invite an admin
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
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" error={!!errors.fullName} {...register("fullName")} />
            <FormError message={errors.fullName?.message} />
          </div>

          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="e.g. jane_admin"
              autoComplete="username"
              error={!!errors.username}
              {...register("username")}
            />
            <FormError message={errors.username?.message} />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" error={!!errors.email} {...register("email")} />
            <FormError message={errors.email?.message} />
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              We'll email an invite link here to set a password.
            </p>
          </div>
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
            {isSubmitting ? "Sending…" : "Send invite"}
          </Button>
        </div>
      </div>
    </div>
  );
}
