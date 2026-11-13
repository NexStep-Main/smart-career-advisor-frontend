import { cn } from "@/lib/utils";

/**
 * Page title block shared by every authenticated page: a tilted colour
 * "sticker" eyebrow, a big rounded title and an optional subtitle/action.
 */
export default function PageHeader({ eyebrow, title, subtitle, action, className }) {
  return (
    <div className={cn("pb-2", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <span className="mb-3 inline-block -rotate-2 rounded-full border-2 border-ink bg-sunny px-3 py-0.5 text-xs font-bold text-night shadow-pop-sm">
              {eyebrow}
            </span>
          )}
          <h1 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 max-w-2xl text-sm text-ink-muted sm:text-base">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
