import { Inbox } from "lucide-react";

/** No-results / no-data placeholder used across list views. */
export default function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
      {/* Hairline ring instead of a filled tile — same affordance, matching
          the rule-based structure used elsewhere on the dashboard. */}
      <div className="flex size-12 items-center justify-center rounded-full border border-border">
        <Icon className="text-slate-400 dark:text-slate-500" size={20} strokeWidth={1.5} />
      </div>
      <h3 className="font-display text-xl text-slate-900 dark:text-slate-50">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
      )}
      {action}
    </div>
  );
}
