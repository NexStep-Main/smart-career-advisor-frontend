import { cn } from "@/lib/utils";

/**
 * Auto-scrolling horizontal strip. Renders `items` twice so the CSS loop can
 * translate -50% and land on an identical copy (seamless, no JS ticker).
 *
 * The duplicate set is aria-hidden so screen readers announce each item once,
 * and the whole strip pauses under prefers-reduced-motion (see index.css).
 */
export default function Marquee({
  items,
  duration = 40,
  reverse = false,
  separator = "—",
  className,
}) {
  const renderSet = (hidden) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-8 pr-8 sm:gap-12 sm:pr-12"
    >
      {items.map((item) => (
        <li key={item} className="flex items-center gap-8 whitespace-nowrap sm:gap-12">
          <span className="font-display text-2xl text-ink sm:text-3xl">{item}</span>
          <span aria-hidden className="text-ink-faint">
            {separator}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={cn("group relative flex overflow-hidden", className)}
      style={{ "--marquee-duration": `${duration}s` }}
    >
      <div
        className={cn(
          "flex min-w-full shrink-0 items-center",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
        )}
      >
        {renderSet(false)}
        {renderSet(true)}
      </div>
    </div>
  );
}
