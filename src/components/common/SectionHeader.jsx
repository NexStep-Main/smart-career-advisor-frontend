import { cn } from "@/lib/utils";

/**
 * In-page section heading: bold rounded title with a chunky colour tick.
 * `index` is accepted and ignored so existing call sites keep working.
 */
export default function SectionHeader({ title, action, className }) {
  return (
    <div className={cn("mb-5 flex items-end justify-between gap-4", className)}>
      <h2 className="flex items-center gap-3 font-display text-xl font-semibold leading-tight text-ink sm:text-2xl">
        <span aria-hidden className="h-6 w-2 rounded-full border-2 border-ink bg-grape" />
        {title}
      </h2>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
