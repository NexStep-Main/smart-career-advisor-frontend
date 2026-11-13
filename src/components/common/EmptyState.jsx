import { Inbox } from "lucide-react";

/** No-results / no-data placeholder used across list views. */
export default function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-ink/40 px-6 py-14 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl border-2 border-ink bg-sunny shadow-pop-sm">
        <Icon className="text-night" size={24} strokeWidth={2} />
      </div>
      <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink-muted">{description}</p>}
      {action}
    </div>
  );
}
