import { cn } from "@/lib/utils";

/**
 * In-page section heading: mono index + serif title, sitting on a hairline
 * rule. The rule is what separates sections now — cards no longer have to
 * carry that job through shadow alone.
 *
 * `index` is a plain ordinal string ("01", "02") mirroring the landing
 * page's typographic numbering, which is what replaced the icon-in-a-box
 * treatment that used to head each block.
 */
export default function SectionHeader({ index, title, action, className }) {
  return (
    <div
      className={cn(
        "mb-5 flex items-end justify-between gap-4 border-b border-border pb-3",
        className,
      )}
    >
      <div className="flex items-baseline gap-3">
        {index && (
          <span className="font-mono text-xs text-slate-400 dark:text-slate-500">{index}</span>
        )}
        <h2 className="font-display text-xl leading-tight text-slate-900 dark:text-slate-50 sm:text-2xl">
          {title}
        </h2>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
