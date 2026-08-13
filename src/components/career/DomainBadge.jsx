import { cn } from "@/lib/utils";

/** Color-coded domain pill — colors sourced from Guide § Design System → domain.*. */
const DOMAIN_STYLES = {
  tech: "bg-primary-light text-primary-dark",
  healthcare: "bg-green-50 text-accent-green",
  arts: "bg-purple-50 text-purple-700",
  commerce: "bg-amber-50 text-amber-700",
  science: "bg-secondary-light text-secondary-dark",
  law: "bg-yellow-50 text-yellow-800",
  design: "bg-red-50 text-red-600",
};

export default function DomainBadge({ domain, className }) {
  const key = domain?.toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold capitalize",
        DOMAIN_STYLES[key] ?? "bg-slate-100 text-slate-600",
        className
      )}
    >
      {domain}
    </span>
  );
}
