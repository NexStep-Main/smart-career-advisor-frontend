import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, MailCheck, SendHorizonal } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import FormError from "@/components/ui/FormError";
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
          <div className="flex size-14 items-center justify-center rounded-full bg-primary-light">
            <MailCheck className="text-primary" size={26} strokeWidth={1.8} />
          </div>
          <h1 className="mt-5 font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Check your inbox
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            If an account exists for{" "}
            <span className="font-medium text-slate-700 dark:text-slate-200">{sentTo}</span>, we've
            sent a link to reset your password. It expires in 30 minutes.
          </p>

          <Link
            to="/login"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-2 hover:underline"
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
      <div className="mb-6 text-center">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Forgot your password?
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Enter your email and we'll send you a link to reset it.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            error={!!errors.email}
            autoFocus
            {...register("email")}
          />
          <FormError message={errors.email?.message} />
        </div>

        <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
          <SendHorizonal size={16} />
          {isSubmitting ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 font-medium text-primary underline-offset-2 hover:underline"
        >
          <ArrowLeft size={14} />
          Back to login
        </Link>
      </p>
    </>
  );
}
