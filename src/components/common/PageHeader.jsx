import { cn } from "@/lib/utils";

/**
 * Page title block shared by every authenticated page.
 *
 * Bridges the landing page's editorial type system into the app: Instrument
 * Serif for the title, JetBrains Mono for the eyebrow label, Inter for the
 * subtitle. The hairline rule underneath replaces the implicit separation
 * that card shadows used to provide.
 *
 * Instrument Serif ships a single (regular) weight, so titles get their
 * presence from scale, not weight — no font-bold here on purpose.
 */
export default function PageHeader({ eyebrow, title, subtitle, action, className }) {
  return (
    <div className={cn("border-b border-border pb-6", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <div className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              {eyebrow}
            </div>
          )}
          <h1 className="font-display text-3xl leading-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
