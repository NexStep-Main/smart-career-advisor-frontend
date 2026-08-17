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
      <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <Icon className="text-slate-400 dark:text-slate-500" size={22} strokeWidth={1.8} />
      </div>
      <h3 className="font-heading text-base font-semibold text-slate-900 dark:text-slate-50">
        {title}
      </h3>
      {description && (
        <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
      )}
      {action}
    </div>
  );
}
