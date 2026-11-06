import { cn } from "@/lib/utils";

/**
 * Auto-scrolling horizontal strip. Renders `items` twice so the CSS loop can
 * translate -50% and land on an identical copy (seamless, no JS ticker).
 *
 * `renderItem(item)` lets the caller draw each entry (chips, icons...);
 * the default just prints the string. The duplicate set is aria-hidden so
 * screen readers announce each item once, and the whole strip pauses under
 * prefers-reduced-motion (see index.css).
 */
export default function Marquee({
  items,
  duration = 40,
  reverse = false,
  renderItem = (item) => item,
  className,
}) {
  const renderSet = (hidden) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-4 pr-4 sm:gap-5 sm:pr-5"
    >
      {items.map((item, i) => (
        <li key={typeof item === "string" ? item : i} className="whitespace-nowrap">
          {renderItem(item, i)}
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
