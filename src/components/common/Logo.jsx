import { Link } from "react-router-dom";
import { Milestone } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { badge: "size-7 rounded-md", icon: 14, text: "text-sm" },
  md: { badge: "size-8 rounded-lg", icon: 17, text: "text-base" },
  lg: { badge: "size-10 rounded-xl", icon: 20, text: "text-lg" },
};

/**
 * Shared brand mark — gradient badge + two-tone "Nex/Step" wordmark. Single
 * source of truth so the brand doesn't drift across Navbar/Footer/AuthLayout/
 * Sidebar the way plain "GraduationCap + text" copies used to.
 */
export default function Logo({ size = "md", to = "/", iconOnly = false, mono = false, className }) {
  const s = SIZES[size];

  // `mono` is the landing page's editorial treatment: a squared ink block and
  // a single-colour wordmark, so the brand mark doesn't reintroduce the app's
  // gradient/accent into a strictly monochrome layout.
  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-heading font-bold",
        mono ? "text-ink" : "text-slate-900 dark:text-slate-50",
        s.text,
        className,
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center shadow-sm",
          mono ? "rounded-none bg-ink" : "bg-linear-to-br from-primary to-primary-dark",
          s.badge,
        )}
      >
        <Milestone
          className={mono ? "text-paper" : "text-white"}
          size={s.icon}
          strokeWidth={2.3}
        />
      </span>
      {!iconOnly && (
        <span>
          Nex<span className={mono ? undefined : "text-primary"}>Step</span>
        </span>
      )}
    </span>
  );

  if (!to) return content;
  return (
    <Link to={to} className="inline-flex items-center">
      {content}
    </Link>
  );
}
