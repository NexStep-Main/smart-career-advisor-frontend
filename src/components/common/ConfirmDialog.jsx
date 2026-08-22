import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";

/**
 * Shared delete/destructive-action confirmation modal used across admin pages.
 *
 * `requireText`, when set, gates the confirm button behind typing that exact
 * string back — for actions too destructive for a single click+click
 * (e.g. permanently deleting a student, as opposed to the reversible
 * soft-delete which just uses the plain confirm).
 *
 * The typed confirmation text is local state that isn't reset when `open`
 * flips — this component stays mounted (returning null) rather than
 * unmounting, so there's no lifecycle moment to clear it without an effect.
 * A caller using `requireText` should pass a `key` that changes per target
 * (e.g. `key={open}`) so React remounts a fresh instance on each open.
 */
export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  description,
  confirmLabel = "Delete",
  loading = false,
  requireText,
  onConfirm,
  onCancel,
}) {
  const [typed, setTyped] = useState("");

  if (!open) return null;

  const locked = !!requireText && typed !== requireText;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-lg">
        <div className="flex size-10 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
          <AlertTriangle className="text-red-500 dark:text-red-400" size={20} strokeWidth={1.8} />
        </div>
        <h3 className="mt-4 font-display text-lg text-slate-900 dark:text-slate-50">{title}</h3>
        {description && (
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        )}

        {requireText && (
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Type <span className="font-mono text-slate-700 dark:text-slate-200">{requireText}</span>{" "}
              to confirm
            </label>
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-slate-900 dark:text-slate-50 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/30"
              autoComplete="off"
              autoFocus
            />
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            className="flex-1 bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
            disabled={loading || locked}
          >
            {loading ? "Deleting…" : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
