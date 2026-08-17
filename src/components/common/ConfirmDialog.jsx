import { AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";

/** Shared delete/destructive-action confirmation modal used across admin pages. */
export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  description,
  confirmLabel = "Delete",
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-lg">
        <div className="flex size-10 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
          <AlertTriangle className="text-red-500 dark:text-red-400" size={20} strokeWidth={1.8} />
        </div>
        <h3 className="mt-4 font-heading text-base font-semibold text-slate-900 dark:text-slate-50">
          {title}
        </h3>
        {description && (
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        )}

        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            className="flex-1 bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting…" : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
