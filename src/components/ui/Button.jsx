import { forwardRef, cloneElement, isValidElement } from "react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  primary:
    "bg-primary text-white shadow-sm hover:bg-primary-dark focus-visible:outline-primary",
  secondary:
    "bg-secondary text-white shadow-sm hover:bg-secondary-dark focus-visible:outline-secondary",
  outline:
    "bg-surface text-slate-700 border border-border hover:bg-slate-50 focus-visible:outline-primary",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:outline-primary",
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
  ref
) {
  const buttonClassName = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors",
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    VARIANTS[variant],
    SIZES[size],
    className
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
