import { cn } from "@/lib/utils";

// Eyebrow sticker colours cycle by section so the page doesn't read as one hue.
const TONES = {
  grape: "bg-grape text-white",
  pink: "bg-bubblegum text-night",
  sunny: "bg-sunny text-night",
  mint: "bg-mint text-night",
  sky: "bg-sky text-night",
  tangerine: "bg-tangerine text-night",
};

/**
 * Landing-page section heading: a tilted colour "sticker" eyebrow, a big
 * rounded display title, and an optional subtitle. Alignment is a prop.
 * `index` (e.g. "§ 01" in the old design) is accepted and ignored so existing
 * call sites keep working.
 */
export default function EditorialHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "grape",
  className,
  titleClassName,
}) {
  const centered = align === "center";

  return (
    <div className={cn("max-w-2xl", centered && "mx-auto text-center", className)}>
      {eyebrow && (
        <span
          className={cn(
            "mb-5 inline-block -rotate-2 rounded-full border-2 border-ink px-4 py-1 text-sm font-bold shadow-pop-sm",
            TONES[tone],
          )}
        >
          {eyebrow}
        </span>
      )}

      <h2
        className={cn(
          "font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-6xl",
          titleClassName,
        )}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={cn(
            "mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg",
            centered && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
