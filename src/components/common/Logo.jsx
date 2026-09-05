import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
};

/**
 * Shared brand mark — a typographic wordmark, no icon/badge. Echoes the
 * footer's oversized "NexStep" and the landing hero's italic "next step."
 * motif, so the mark reads as part of the same editorial system wherever
 * it's rendered (Navbar/Sidebar/AuthLayout/Footer), instead of a leftover
 * icon-in-a-box.
 *
 * `mono` is the landing page's editorial register: a single ink colour
 * instead of the app's primary accent, so the brand mark doesn't reintroduce
 * colour into a strictly monochrome layout. `admin` swaps the accent to the
 * admin console's amber instead of the student product's emerald, so the
 * wordmark itself signals which surface you're on.
 */
export default function Logo({ size = "md", to = "/", mono = false, admin = false, className }) {
  const accentClass = mono ? "text-ink" : admin ? "text-admin-accent" : "text-primary";

  const content = (
    <span
      className={cn(
        "inline-flex items-baseline font-heading font-bold tracking-tight",
        mono ? "text-ink" : "text-slate-900 dark:text-slate-50",
        SIZES[size],
        className,
      )}
    >
      Nex
      <span className={cn("font-display italic", accentClass)}>Step</span>
      <span
        className={cn(
          "font-display not-italic",
          mono ? "text-ink-faint" : "text-slate-300 dark:text-slate-600",
        )}
      >
        .
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
