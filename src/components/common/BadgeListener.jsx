import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { BADGE_EVENT, BADGE_STYLE, FALLBACK_BADGE_STYLE } from "@/lib/badges";
import Confetti from "@/components/common/Confetti";

/**
 * Listens for newly earned badges (the API client fires BADGE_EVENT whenever
 * a response carries `newBadges`) and celebrates each with a toast, then
 * refreshes the progress query so the shelf updates. Mount once, inside the
 * QueryClientProvider. Renders nothing.
 */
export default function BadgeListener() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const onBadges = (event) => {
      const badges = event.detail ?? [];
      badges.forEach((badge, i) => {
        const style = BADGE_STYLE[badge.key] ?? FALLBACK_BADGE_STYLE;
        const Icon = style.icon;
        setTimeout(() => {
          toast.custom(
            (t) => (
              <div
                className={`relative flex items-center gap-3 overflow-hidden rounded-2xl border-2 border-ink bg-surface px-4 py-3 shadow-pop transition-all ${
                  t.visible ? "animate-pop-in" : "opacity-0"
                }`}
              >
                <Confetti count={24} />
                <span className={`relative flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-ink ${style.bg}`}>
                  <Icon size={20} className="text-night" />
                </span>
                <span className="relative">
                  <span className="block text-xs font-bold uppercase tracking-wider text-grape dark:text-primary">
                    New badge
                  </span>
                  <span className="block font-display text-lg font-semibold leading-tight text-ink">{badge.title}</span>
                  <span className="block text-xs text-ink-muted">{badge.description}</span>
                </span>
              </div>
            ),
            { duration: 4500 },
          );
        }, i * 700);
      });
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    };

    window.addEventListener(BADGE_EVENT, onBadges);
    return () => window.removeEventListener(BADGE_EVENT, onBadges);
  }, [queryClient]);

  return null;
}
