import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/** Base Input primitive. Pairs with react-hook-form via ref forwarding. */
const Input = forwardRef(function Input({ className, error, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-lg border bg-surface px-4 text-sm text-slate-900 placeholder:text-slate-400",
        "transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30",
        error ? "border-red-400 focus:border-red-400" : "border-border focus:border-primary",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});

export default Input;
