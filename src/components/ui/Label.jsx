import { cn } from "@/lib/utils";

export default function Label({ className, ...props }) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200",
        className,
      )}
      {...props}
    />
  );
}
