import { Link } from "react-router-dom";
import { Flame } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";

/** Daily-visit streak in the top bar. Warm and lit when there is a streak, muted at 0. */
export default function StreakChip({ className }) {
  const { data } = useProgress();
  const streak = data?.streak ?? 0;
  const lit = streak > 0;

  return (
    <Link
      to="/dashboard"
      title={lit ? `${streak}-day streak. Best: ${data?.bestStreak ?? streak}` : "Visit tomorrow to start a streak"}
      aria-label={lit ? `${streak} day streak` : "No streak yet"}
      className={cn(
        "flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1 text-sm font-bold transition-all hover:-translate-y-0.5",
        lit ? "bg-tangerine text-night shadow-pop-sm" : "bg-surface text-ink-muted",
        className,
      )}
    >
      <Flame size={16} className={lit ? "animate-wiggle" : ""} fill={lit ? "currentColor" : "none"} />
      {streak}
    </Link>
  );
}
