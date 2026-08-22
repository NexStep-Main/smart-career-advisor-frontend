import { forwardRef, cloneElement, isValidElement } from "react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  primary:
    "bg-primary text-white shadow-sm hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25 focus-visible:outline-primary",
  secondary:
    "bg-secondary text-white shadow-sm hover:bg-secondary-dark hover:shadow-lg hover:shadow-secondary/25 focus-visible:outline-secondary",
  outline:
    "bg-surface text-slate-700 dark:text-slate-200 border border-border hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-primary/30 focus-visible:outline-primary",
  ghost:
    "bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-primary",

  // Admin portal only — steel blue instead of emerald, otherwise identical
  // shape/motion to `primary` so admin buttons still feel like the same
  // component family, just a different surface.
  admin:
    "bg-admin-accent text-white shadow-sm hover:bg-admin-accent-dark hover:shadow-lg hover:shadow-admin-accent/25 focus-visible:outline-admin-accent",

  // Editorial variants — landing page only. Squared instead of pill, no
  // colour, no lift/glow: the monochrome layout gets its emphasis from the
  // ink/paper inversion on hover rather than motion or shadow. The overrides
  // after each palette resolve against the shared base classes below
  // (tailwind-merge, last wins).
  ink: "bg-ink text-paper hover:bg-ink/85 focus-visible:outline-ink rounded-none hover:translate-y-0 active:translate-y-0 active:scale-100",
  inkOutline:
    "bg-transparent text-ink border border-ink hover:bg-ink hover:text-paper focus-visible:outline-ink rounded-none hover:translate-y-0 active:translate-y-0 active:scale-100",
};

const SIZES = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
};

/**
 * Base Button primitive. Pill-shaped per Guide (rounded-full for buttons).
 */
const Button = forwardRef(function Button(
  { className, variant = "primary", size = "md", asChild = false, children, ...props },
  ref,
) {
  const buttonClassName = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200",
    "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]",
    "disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-sm",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    VARIANTS[variant],
    SIZES[size],
    className,
  );

  // asChild merges button styling onto the single child element (e.g. a
  // react-router <Link>) instead of wrapping it, so the whole hit area stays
  // clickable — a lightweight stand-in for Radix's <Slot>.
  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      ref,
      className: cn(buttonClassName, children.props.className),
      ...props,
    });
  }

  return (
    <button ref={ref} className={buttonClassName} {...props}>
      {children}
    </button>
  );
});

export default Button;
