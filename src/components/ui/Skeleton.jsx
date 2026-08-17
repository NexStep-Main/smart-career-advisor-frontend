import { cn } from "@/lib/utils";

/** Loading placeholder block for TanStack Query pending states. */
export default function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700", className)}
      {...props}
    />
  );
}
