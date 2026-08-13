import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 * Standard shadcn/ui pattern: clsx for conditionals, tailwind-merge to dedupe.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
