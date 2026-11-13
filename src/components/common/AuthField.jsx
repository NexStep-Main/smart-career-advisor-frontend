import FormError from "@/components/ui/FormError";
import { cn } from "@/lib/utils";

/**
 * Hairline form field for the auth flow (login/register/forgot/reset) —
 * matches the footer newsletter input treatment (Footer.jsx) instead of the
 * app's default boxed Input, so the auth flow reads as a continuation of the
 * landing page's editorial system rather than a generic SaaS form.
 */
export default function AuthField({ label, htmlFor, error, className, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block font-mono text-xs uppercase tracking-[0.18em] text-ink-faint"
      >
        {label}
      </label>
      <div
        className={cn(
          "flex items-center gap-3 border-b pb-3 transition-colors focus-within:border-ink",
          error ? "border-red-400" : "border-rule",
          className,
        )}
      >
        {children}
      </div>
      <FormError message={error} />
    </div>
  );
}
