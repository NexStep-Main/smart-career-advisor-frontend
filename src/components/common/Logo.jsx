import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { text: "text-lg", mark: "size-6" },
  md: { text: "text-xl", mark: "size-8" },
  lg: { text: "text-3xl", mark: "size-10" },
};

/**
 * Brand mark — three ascending "steps" in the playful palette (the product is
 * literally the next step up) followed by a rounded wordmark.
 *
 * `mono` is kept for existing call sites (landing/auth chrome) and now simply
 * means "use the theme ink for the wordmark"; the stair mark always keeps its
 * colours since that is the brand. `admin` swaps the accent to the admin
 * console's amber so the mark signals which surface you're on.
 */
export default function Logo({ size = "md", to = "/", mono = false, admin = false, className }) {
  const s = SIZES[size];
  const accentClass = admin ? "text-admin-accent" : "text-grape dark:text-primary";

  const content = (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 32 32"
        className={cn("shrink-0", s.mark)}
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      >
        <g className={admin ? "text-admin-bg" : "text-night dark:text-ink"}>
          <rect x="2" y="19" width="9" height="11" rx="2.5" fill={admin ? "#e0a940" : "#2dd4a7"} />
          <rect x="11.5" y="11" width="9" height="19" rx="2.5" fill={admin ? "#c8932c" : "#ffc933"} />
          <rect x="21" y="3" width="9" height="27" rx="2.5" fill={admin ? "#e0a940" : "#ff5c8a"} />
        </g>
      </svg>
      <span
        className={cn(
          "font-display font-bold leading-none tracking-tight",
          mono ? "text-ink" : "text-slate-900 dark:text-slate-50",
          s.text,
        )}
      >
        Nex<span className={accentClass}>Step</span>
      </span>
    </span>
  );

  if (!to) return content;
  return (
    <Link to={to} className="inline-flex items-center">
      {content}
    </Link>
  );
}
