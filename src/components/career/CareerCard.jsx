import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark, TrendingUp, Scale, Flame } from "lucide-react";
import toast from "react-hot-toast";
import DomainBadge from "./DomainBadge";
import { getBookmarks, addBookmark, removeBookmark } from "@/services/bookmarks";
import useCareerStore from "@/store/useCareerStore";
import useRequireAuth from "@/hooks/useRequireAuth";
import { cn } from "@/lib/utils";

/**
 * Career summary card — domain badge, AI match %, salary range, save toggle.
 * Used on Dashboard, Explorer, Recommendations, Saved.
 *
 * Save state is backed by the real /api/bookmarks endpoints (TanStack Query
 * dedupes the ["bookmarks"] query across every card instance on the page,
 * so this doesn't mean one network call per card).
 *
 * The card body is a full-bleed clickable link, and the save toggle is a
 * real <button> layered above it — a <button> can't nest inside an <a>
 * (invalid HTML), so it sits alongside as a sibling with higher z-index
 * rather than as a child of the Link.
 */
export default function CareerCard({ career }) {
  const { id, title, domain, matchPercent, salaryRange, bookmarkCount } = career;
  const queryClient = useQueryClient();

  const { isAuthenticated, requireAuth } = useRequireAuth();

  // Guests have no bookmarks (the endpoint needs a login), so don't ask.
  const { data: bookmarks } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => getBookmarks().then((res) => res.data.data.careers),
    enabled: isAuthenticated,
  });
  const isSaved = bookmarks?.some((c) => c.id === id) ?? false;

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] });

  const addMutation = useMutation({
    mutationFn: () => addBookmark(id),
    onSuccess: invalidate,
    onError: () => toast.error("Couldn't save this career."),
  });
  const removeMutation = useMutation({
    mutationFn: () => removeBookmark(id),
    onSuccess: invalidate,
    onError: () => toast.error("Couldn't remove this career."),
  });

  const handleToggle = (e) => {
    e.preventDefault();
    requireAuth(
      () => (isSaved ? removeMutation.mutate() : addMutation.mutate()),
      "Log in to save careers — it's free!",
    );
  };

  const compareList = useCareerStore((state) => state.compareList);
  const addToCompare = useCareerStore((state) => state.addToCompare);
  const removeFromCompare = useCareerStore((state) => state.removeFromCompare);
  const isComparing = compareList.some((c) => c.id === id);

  const handleCompareToggle = (e) => {
    e.preventDefault();
    if (isComparing) {
      removeFromCompare(id);
      return;
    }
    const added = addToCompare(career);
    if (!added) toast.error("You can compare up to 3 careers at a time.");
  };

  return (
    <div className="group relative rounded-2xl border-2 border-ink bg-surface p-5 shadow-pop-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-pop">
      <Link to={`/careers/${id}`} className="absolute inset-0 z-0" aria-label={title} />

      <div className="mb-3 flex items-start justify-between gap-3">
        <DomainBadge domain={domain} />
        <div className="relative z-10 flex shrink-0 items-center gap-1">
          <button
            onClick={handleCompareToggle}
            aria-label={isComparing ? "Remove from comparison" : "Add to comparison"}
            className={cn(
              "rounded-full p-1.5 transition-colors",
              isComparing
                ? "text-primary"
                : "text-slate-300 dark:text-slate-600 hover:text-slate-400 dark:hover:text-slate-500",
            )}
          >
            <Scale size={17} />
          </button>
          <button
            onClick={handleToggle}
            disabled={addMutation.isPending || removeMutation.isPending}
            aria-label={isSaved ? "Remove from saved" : "Save career"}
            className={cn(
              "rounded-full p-1.5 transition-colors",
              isSaved
                ? "text-primary"
                : "text-slate-300 dark:text-slate-600 hover:text-slate-400 dark:hover:text-slate-500",
            )}
          >
            <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Inter, not the display serif: card titles sit in scan-heavy grids
          and read as data here, per the dashboard type split. */}
      <h3 className="mb-1 font-display text-lg font-semibold leading-snug text-ink group-hover:text-grape dark:group-hover:text-primary">
        {title}
      </h3>

      {salaryRange && (
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">{salaryRange}</p>
      )}

      {typeof matchPercent === "number" && (
        <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-mint px-2.5 py-0.5 text-xs font-bold text-night">
          <TrendingUp size={13} />
          {matchPercent}% match
        </div>
      )}

      {typeof bookmarkCount === "number" && (
        <div className="flex items-center gap-2 text-sm font-medium text-secondary-dark">
          <Flame size={15} />
          {bookmarkCount} student{bookmarkCount === 1 ? "" : "s"} interested
        </div>
      )}
    </div>
  );
}
