/** Eyebrow + title + optional subtitle — repeated pattern across landing sections. */
export default function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="mx-auto mb-12 max-w-xl text-center">
      {eyebrow && (
        <div className="mb-3 flex items-center justify-center gap-2">
          <span className="h-px w-6 bg-linear-to-r from-transparent to-primary/50" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {eyebrow}
          </span>
          <span className="h-px w-6 bg-linear-to-l from-transparent to-primary/50" />
        </div>
      )}
      <h2 className="font-heading text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-slate-500 dark:text-slate-400">{subtitle}</p>}
    </div>
  );
}
