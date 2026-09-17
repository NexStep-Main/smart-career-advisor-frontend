import { LayoutTemplate } from "lucide-react";
import { ROADMAP_TEMPLATES } from "@/lib/roadmapTemplates";

/**
 * Quick-start skeletons shown only while the phase list is still in its
 * pristine just-opened state (see AdminRoadmapFormPage's `isPristine`) —
 * once the admin has actually started customizing, this disappears so it
 * never looks like an offer to silently wipe real work.
 */
export default function RoadmapTemplatePicker({ onApply }) {
  return (
    <div className="mb-4 rounded-lg border border-dashed border-admin-accent/40 bg-admin-accent-light/40 p-3">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-admin-accent-dark">
        <LayoutTemplate size={14} strokeWidth={1.8} />
        Quick start — apply a template, then customize it on the timeline below
      </div>
      <div className="flex flex-wrap gap-2">
        {ROADMAP_TEMPLATES.map((template) => (
          <button
            key={template.key}
            type="button"
            onClick={() => onApply(template.phases)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-left transition-colors hover:border-admin-accent hover:bg-admin-accent-light"
          >
            <div className="text-sm font-medium text-slate-900 dark:text-slate-50">
              {template.label}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{template.summary}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
