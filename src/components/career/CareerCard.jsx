import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark, TrendingUp, Scale } from "lucide-react";
import toast from "react-hot-toast";
import DomainBadge from "./DomainBadge";
import { getBookmarks, addBookmark, removeBookmark } from "@/services/bookmarks";
import useCareerStore from "@/store/useCareerStore";
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
  const { id, title, domain, matchPercent, salaryRange } = career;
  const queryClient = useQueryClient();

  const { data: bookmarks } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => getBookmarks().then((res) => res.data.data.careers),
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
    if (isSaved) removeMutation.mutate();
    else addMutation.mutate();
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
    <div className="group relative rounded-xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md">
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

      <h3 className="mb-1 font-heading text-base font-semibold text-slate-900 dark:text-slate-50 group-hover:text-primary">
        {title}
      </h3>

      {salaryRange && (
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">{salaryRange}</p>
      )}

      {typeof matchPercent === "number" && (
        <div className="flex items-center gap-2 text-sm font-medium text-accent-green">
          <TrendingUp size={15} />
          {matchPercent}% match
        </div>
      )}
    </div>
  );
}
