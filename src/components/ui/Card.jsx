import { cn } from "@/lib/utils";

/** Card primitives — rounded-xl per Guide, shadow-sm default / shadow-md on hover. */
export function Card({ className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface shadow-sm",
        hover && "transition-shadow hover:shadow-md",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("flex flex-col gap-1 p-6 pb-0", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn(
        "font-heading text-lg font-semibold text-slate-900 dark:text-slate-50",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }) {
  return <p className={cn("text-sm text-slate-500 dark:text-slate-400", className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return <div className={cn("flex items-center gap-3 p-6 pt-0", className)} {...props} />;
}
