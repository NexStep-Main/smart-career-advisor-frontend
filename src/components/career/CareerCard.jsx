import { Link } from "react-router-dom";
import { Bookmark, TrendingUp } from "lucide-react";
import DomainBadge from "./DomainBadge";
import useCareerStore from "@/store/useCareerStore";
import { cn } from "@/lib/utils";

/**
 * Career summary card — domain badge, AI match %, salary range, save toggle.
 * Used on Dashboard, Explorer, Recommendations, Saved.
 *
 * The card body is a full-bleed clickable link, and the save toggle is a
 * real <button> layered above it — a <button> can't nest inside an <a>
 * (invalid HTML), so it sits alongside as a sibling with higher z-index
 * rather than as a child of the Link.
 */
export default function CareerCard({ career }) {
  const { id, title, domain, matchPercent, salaryRange } = career;
  const savedCareers = useCareerStore((state) => state.savedCareers);
  const toggleSave = useCareerStore((state) => state.toggleSave);
  const isSaved = savedCareers.some((c) => c.id === id);

  return (
    <div className="group relative rounded-xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md">
      <Link to={`/careers/${id}`} className="absolute inset-0 z-0" aria-label={title} />

      <div className="mb-3 flex items-start justify-between gap-3">
        <DomainBadge domain={domain} />
        <button
          onClick={() => toggleSave(career)}
          aria-label={isSaved ? "Remove from saved" : "Save career"}
          className={cn(
            "relative z-10 shrink-0 rounded-full p-1.5 transition-colors",
            isSaved ? "text-primary" : "text-slate-300 hover:text-slate-400"
          )}
        >
          <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      <h3 className="mb-1 font-heading text-base font-semibold text-slate-900 group-hover:text-primary">
        {title}
      </h3>

      {salaryRange && <p className="mb-4 text-sm text-slate-500">{salaryRange}</p>}

      {typeof matchPercent === "number" && (
        <div className="flex items-center gap-2 text-sm font-medium text-accent-green">
          <TrendingUp size={15} />
          {matchPercent}% match
        </div>
      )}
    </div>
  );
}
