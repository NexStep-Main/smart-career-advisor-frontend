import { cn } from "@/lib/utils";

const VARIANTS = {
  primary: "bg-primary-light text-primary-dark",
  secondary: "bg-secondary-light text-secondary-dark",
  neutral: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
  green: "bg-green-50 dark:bg-green-900/20 text-accent-green",
  orange: "bg-orange-50 dark:bg-orange-900/20 text-accent-orange",
};

/** Small pill tag — rounded-lg per Guide (tags/chips), not full-pill. */
export default function Badge({ className, variant = "neutral", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}
