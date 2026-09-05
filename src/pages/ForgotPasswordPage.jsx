import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, MailCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import AuthField from "@/components/common/AuthField";
import SEOHead from "@/components/common/SEOHead";
import { forgotPasswordRequest } from "@/services/auth";
import { forgotPasswordSchema } from "@/utils/schemas";

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (values) => {
    // Backend always replies with the same generic success message whether or
    // not the account exists, so there's nothing to branch on here — the UI
    // just needs to reflect that a link was sent, not who's registered.
    await forgotPasswordRequest(values).catch(() => {});
    setSentTo(values.email);
  };

  if (sentTo) {
    return (
      <>
        <SEOHead title="Check your email" />
        <div className="flex flex-col items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-full border border-rule">
            <MailCheck className="text-ink-muted" size={22} strokeWidth={1.5} />
          </div>
          <h1 className="mt-5 font-display text-3xl text-ink">Check your inbox</h1>
          <p className="mt-2 text-sm text-ink-muted">
            If an account exists for <span className="text-ink">{sentTo}</span>, we've sent a
            link to reset your password. It expires in 30 minutes.
          </p>

          <Link
            to="/login"
            className="mt-8 inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft size={15} />
            Back to login
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Forgot password" />
      <h1 className="mb-2 font-display text-4xl leading-tight text-ink">
        Forgot your password?
      </h1>
      <p className="mb-8 text-sm text-ink-muted">
        Enter your email and we'll send you a link to reset it.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
        <AuthField label="Email" htmlFor="email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoFocus
            className="w-full min-w-0 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
            {...register("email")}
          />
        </AuthField>

        <Button type="submit" variant="ink" size="lg" disabled={isSubmitting} className="mt-2 w-full">
          {isSubmitting ? "Sending…" : "Send reset link"}
          <ArrowRight size={16} />
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-muted">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft size={14} />
          Back to login
        </Link>
      </p>
    </>
  );
}
