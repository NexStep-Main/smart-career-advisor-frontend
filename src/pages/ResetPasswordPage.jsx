import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import AuthField from "@/components/common/AuthField";
import PasswordStrengthMeter from "@/components/common/PasswordStrengthMeter";
import SEOHead from "@/components/common/SEOHead";
import { resetPasswordRequest } from "@/services/auth";
import { resetPasswordSchema } from "@/utils/schemas";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);
  // This link/flow is shared by a student's forgotten-password reset and an
  // invited admin setting their first password — defaults to the student
  // login since that's the common case, but flips once the response tells
  // us who actually just reset their password.
  const [loginPath, setLoginPath] = useState("/login");

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });
  const passwordValue = watch("password");

  const onSubmit = async (values) => {
    try {
      const { data } = await resetPasswordRequest(token, values);
      if (data.data?.role && data.data.role !== "student") setLoginPath("/admin/login");
      setDone(true);
    } catch (error) {
      // The generic "Validation failed" message alone doesn't say WHICH
      // rule failed — map the server's field-level detail onto the actual
      // fields (same pattern as CreateAdminModal/AdminSetupPage) so the
      // real reason shows up inline instead of a useless toast.
      const fieldErrors = error.response?.data?.error?.fieldErrors;
      if (fieldErrors) {
        for (const [field, messages] of Object.entries(fieldErrors)) {
          if (messages?.[0]) setError(field, { type: "server", message: messages[0] });
        }
        return;
      }
      toast.error(error.response?.data?.message ?? "This reset link is invalid or has expired.");
    }
  };

  if (done) {
    return (
      <>
        <SEOHead title="Password reset" />
        <div className="flex flex-col items-center text-center">
          {/* Checkmark keeps full-strength emerald — a genuinely semantic
              "done" state, not decoration. */}
          <div className="flex size-12 items-center justify-center rounded-full border border-rule">
            <CheckCircle2 className="text-accent-green" size={22} strokeWidth={1.5} />
          </div>
          <h1 className="mt-5 font-display text-3xl text-ink">Password reset</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Your password has been updated. Log in with your new password.
          </p>
          <Button
            variant="ink"
            size="lg"
            className="mt-8 w-full"
            onClick={() => navigate(loginPath, { replace: true })}
          >
            Continue to login
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Reset password" />
      <h1 className="mb-2 font-display text-4xl leading-tight text-ink">Set a new password</h1>
      <p className="mb-8 text-sm text-ink-muted">Choose something you haven't used before.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
        <AuthField label="New password" htmlFor="password" error={errors.password?.message}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 8 characters"
            autoFocus
            className="w-full min-w-0 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="shrink-0 text-ink-faint transition-colors hover:text-ink"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </AuthField>
        <PasswordStrengthMeter password={passwordValue} />

        <AuthField
          label="Confirm new password"
          htmlFor="confirmPassword"
          error={errors.confirmPassword?.message}
        >
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Re-enter password"
            className="w-full min-w-0 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
            {...register("confirmPassword")}
          />
        </AuthField>

        <Button type="submit" variant="ink" size="lg" disabled={isSubmitting} className="mt-2 w-full">
          {isSubmitting ? "Resetting…" : "Reset password"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-muted">
        Remembered it after all?{" "}
        <Link to="/login" className="text-ink underline underline-offset-4 hover:text-ink/70">
          Log in
        </Link>
      </p>
    </>
  );
}
