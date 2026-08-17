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
export default function Logo({ size = "md", to = "/", iconOnly = false, className }) {
  const s = SIZES[size];

  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-heading font-bold text-slate-900 dark:text-slate-50",
        s.text,
        className,
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center bg-linear-to-br from-primary to-primary-dark shadow-sm",
          s.badge,
        )}
      >
        <Milestone className="text-white" size={s.icon} strokeWidth={2.3} />
      </span>
      {!iconOnly && (
        <span>
          Nex<span className="text-primary">Step</span>
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
