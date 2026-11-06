import { Lock } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { BADGE_STYLE, FALLBACK_BADGE_STYLE } from "@/lib/badges";
import Skeleton from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

/**
 * The student's badges: earned ones in colour, the rest as locked outlines
 * (with the hint of how to earn them), so there is always a next goal.
 */
export default function BadgeShelf({ className }) {
  const { data, isLoading } = useProgress();

  if (isLoading || !data) {
    return (
      <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-4", className)}>
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
  }

  const earned = new Map(data.badges.map((b) => [b.key, b]));

  return (
    <div>
      <ul className={cn("grid grid-cols-2 gap-3 sm:grid-cols-4", className)}>
        {data.catalog.map((badge) => {
          const style = BADGE_STYLE[badge.key] ?? FALLBACK_BADGE_STYLE;
          const Icon = style.icon;
          const have = earned.has(badge.key);
          return (
            <li
              key={badge.key}
              title={badge.description}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border-2 p-3 text-center transition-transform",
                have
                  ? "border-ink bg-surface shadow-pop-sm hover:-translate-y-0.5"
                  : "border-dashed border-ink/30 bg-transparent",
              )}
            >
              <span
                className={cn(
                  "flex size-12 items-center justify-center rounded-full border-2",
                  have ? `border-ink ${style.bg}` : "border-ink/30 text-ink-faint",
                )}
              >
                {have ? <Icon size={22} className={style.bg.includes("text-white") ? "text-white" : "text-night"} /> : <Lock size={18} />}
              </span>
              <span className={cn("text-sm font-bold leading-tight", have ? "text-ink" : "text-ink-faint")}>
                {badge.title}
              </span>
              <span className="text-xs leading-snug text-ink-muted">{badge.description}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-sm font-semibold text-ink-muted">
        {earned.size} of {data.catalog.length} badges earned
      </p>
    </div>
  );
}
