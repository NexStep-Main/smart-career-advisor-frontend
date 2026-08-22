import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import FormError from "@/components/ui/FormError";
import { adminEditStudentSchema } from "@/utils/schemas";
import { EDUCATION_LEVELS, STREAMS } from "@/lib/constants";

// Maps backend validation-error shapes onto react-hook-form field errors
// instead of a flat toast, so "email already in use" lands under the email
// field the same way a client-side validation error would.
// - Zod (via validate.middleware.js): { error: { fieldErrors: { field: [msg] } } }
// - Mongoose ValidationError: { error: { field: "msg" } } (flat)
function applyServerFieldErrors(error, setError) {
  const payload = error.response?.data?.error;
  if (!payload || typeof payload !== "object") return false;

  let applied = false;
  if (payload.fieldErrors) {
    for (const [field, messages] of Object.entries(payload.fieldErrors)) {
      if (messages?.[0]) {
        setError(field, { type: "server", message: messages[0] });
        applied = true;
      }
    }
  } else {
    for (const [field, message] of Object.entries(payload)) {
      if (typeof message === "string") {
        setError(field, { type: "server", message });
        applied = true;
      }
    }
  }
  return applied;
}

export default function StudentEditModal({ open, student, onClose, onSubmit, isSubmitting }) {
  const {
    register,
    handleSubmit,
    reset,
    trigger,
    setError,
    formState: { errors, isValid },
  } = useForm({ resolver: zodResolver(adminEditStudentSchema), mode: "onChange" });

  useEffect(() => {
    if (open && student) {
      reset({
        fullName: student.fullName ?? "",
        email: student.email ?? "",
        educationLevel: student.educationLevel ?? "",
        stream: student.stream ?? "",
      });
      // reset() doesn't re-run validation on its own — trigger it so
      // `isValid` (which gates the submit button below) reflects the
      // prefilled data immediately instead of staying stale until the
      // admin's first keystroke.
      trigger();
    }
  }, [open, student, reset, trigger]);

  if (!open) return null;

  const submit = async (values) => {
    try {
      // Empty-string stream means "leave unset" — don't send it as a value
      // the enum validator would reject.
      await onSubmit({ ...values, stream: values.stream || undefined });
    } catch (error) {
      if (error.response?.status === 409) {
        setError("email", { type: "server", message: error.response.data.message });
        return;
      }
      const applied = applyServerFieldErrors(error, setError);
      if (!applied) {
        toast.error(error.response?.data?.message ?? "Couldn't update this student.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 py-8 sm:items-center">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface shadow-lg">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-display text-lg text-slate-900 dark:text-slate-50">Edit student</h3>
          <button
            onClick={onClose}
            className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(submit)}
          noValidate
          className="flex flex-col gap-4 px-6 py-5"
        >
          <div>
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" error={!!errors.fullName} {...register("fullName")} />
            <FormError message={errors.fullName?.message} />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" error={!!errors.email} {...register("email")} />
            <FormError message={errors.email?.message} />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="educationLevel">Education level</Label>
              <select
                id="educationLevel"
                className="h-11 w-full rounded-lg border border-border bg-surface px-4 text-sm text-slate-900 dark:text-slate-50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                {...register("educationLevel")}
              >
                <option value="" disabled>
                  Select
                </option>
                {EDUCATION_LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
              <FormError message={errors.educationLevel?.message} />
            </div>
            <div>
              <Label htmlFor="stream">
                Stream <span className="font-normal text-slate-400">(optional)</span>
              </Label>
              <select
                id="stream"
                className="h-11 w-full rounded-lg border border-border bg-surface px-4 text-sm text-slate-900 dark:text-slate-50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                {...register("stream")}
              >
                <option value="">Not set</option>
                {STREAMS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <FormError message={errors.stream?.message} />
            </div>
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
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
