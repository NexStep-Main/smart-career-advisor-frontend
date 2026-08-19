import { cn } from "@/lib/utils";

/**
 * Editorial section heading — the landing page's replacement for
 * SectionHeading (which is centre-locked and carries gradient rules that
 * don't belong in a monochrome layout).
 *
 * Differences that matter here: alignment is a prop rather than hardcoded
 * centre, the eyebrow is a plain indexed label instead of a decorated pill,
 * and the title uses the display serif at a much larger scale — the type
 * does the work that colour and ornament used to.
 */
export default function EditorialHeading({
  index,
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
  titleClassName,
}) {
  const centered = align === "center";

  return (
    <div className={cn("max-w-2xl", centered && "mx-auto text-center", className)}>
      {(eyebrow || index) && (
        <div
          className={cn(
            "mb-6 flex items-baseline gap-3 text-xs uppercase tracking-[0.2em] text-ink-muted",
            centered && "justify-center",
          )}
        >
          {index && <span className="font-mono text-ink-faint">{index}</span>}
          {eyebrow && <span>{eyebrow}</span>}
        </div>
      )}

      <h2
        className={cn(
          "font-display text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl",
          titleClassName,
        )}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={cn(
            "mt-5 max-w-xl text-base leading-relaxed text-ink-muted",
            centered && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
