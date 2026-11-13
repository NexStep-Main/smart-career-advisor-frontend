import { CheckCircle2, AlertTriangle, X } from "lucide-react";
import Button from "@/components/ui/Button";

/**
 * Report shown after a CSV import — the backend imports whatever rows are
 * valid and reports the rest instead of an all-or-nothing failure (see
 * importCareers in admin.controller.js), so this needs to show both a
 * success count AND a per-row failure list in the same view.
 */
export default function CareerImportResultDialog({ open, result, onClose }) {
  if (!open || !result) return null;

  const { created, failed } = result;
  const hasFailures = failed.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 py-8 sm:items-center">
      <div className="w-full max-w-lg rounded-xl border border-border bg-surface shadow-lg">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-display text-lg text-slate-900 dark:text-slate-50">Import results</h3>
          <button
            onClick={onClose}
            className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
            <CheckCircle2 className="shrink-0 text-emerald-500" size={20} strokeWidth={1.8} />
            <p className="text-sm text-slate-700 dark:text-slate-200">
              <span className="font-semibold text-slate-900 dark:text-slate-50">{created}</span>{" "}
              career{created === 1 ? "" : "s"} imported successfully.
            </p>
          </div>

          {hasFailures && (
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-red-500 dark:text-red-400">
                <AlertTriangle size={16} strokeWidth={1.8} />
                {failed.length} row{failed.length === 1 ? "" : "s"} skipped
              </div>
              <div className="max-h-64 overflow-y-auto rounded-lg border border-border">
                {failed.map((f) => (
                  <div
                    key={f.row}
                    className="border-b border-border px-4 py-2.5 text-sm last:border-0"
                  >
                    <div className="font-medium text-slate-800 dark:text-slate-100">
                      Row {f.row} — {f.title}
                    </div>
                    <ul className="mt-1 list-disc pl-4 text-xs text-slate-500 dark:text-slate-400">
                      {f.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                Fix these rows in your spreadsheet and re-import just them — already-imported rows
                won't be duplicated as long as you remove them from the file first.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-border px-6 py-4">
          <Button variant="admin" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
