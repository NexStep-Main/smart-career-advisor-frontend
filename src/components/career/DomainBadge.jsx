import { cn } from "@/lib/utils";

// Color-coded domain pill — colors sourced from Guide § Design System → domain.*.
// Keyed by the actual free-text `domain` values Career documents store
// (see Backend seedCareers.js), lowercased — not abbreviations, or nothing
// would ever match and every badge would silently fall back to slate.
const DOMAIN_STYLES = {
  technology: "bg-primary-light text-primary-dark",
  healthcare: "bg-green-50 dark:bg-green-900/20 text-accent-green",
  arts: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400",
  commerce: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400",
  science: "bg-secondary-light text-secondary-dark",
  law: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400",
  design: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
  government: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200",
  business: "bg-secondary-light text-secondary-dark",
  engineering: "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400",
};

export default function DomainBadge({ domain, className }) {
  const key = domain?.toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold capitalize",
        DOMAIN_STYLES[key] ?? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
        className,
      )}
    >
      {domain}
    </span>
  );
}
