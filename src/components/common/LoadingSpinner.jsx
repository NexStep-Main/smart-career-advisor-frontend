import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Full-page loader, e.g. while auth/session state resolves. */
export default function LoadingSpinner({ fullPage = false, className }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        fullPage && "min-h-screen w-full",
        className,
      )}
    >
      <Loader2 className="animate-spin text-primary" size={28} strokeWidth={2} />
    </div>
  );
}
