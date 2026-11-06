import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowRight, ChevronDown, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import AuthField from "@/components/common/AuthField";
import PasswordStrengthMeter from "@/components/common/PasswordStrengthMeter";
import SEOHead from "@/components/common/SEOHead";
import useAuthStore from "@/store/useAuthStore";
import { registerRequest } from "@/services/auth";
import { registerSchema } from "@/utils/schemas";

const EDUCATION_LEVELS = [
  { value: "class10", label: "Class 10" },
  { value: "class12", label: "Class 12" },
  { value: "graduation", label: "Graduation" },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [existingEmail, setExistingEmail] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      // Set when a Google sign-in attempt on /login found no matching
      // account — see LoginPage.jsx's handleGoogleCredential.
      email: location.state?.prefillEmail ?? "",
      fullName: location.state?.prefillFullName ?? "",
    },
  });
  const passwordValue = watch("password");

  const onSubmit = async (values) => {
    try {
      const { data } = await registerRequest(values);
      login(data.data.user, data.data.token);
      navigate("/onboarding", { replace: true });
    } catch (error) {
      if (error.response?.status === 409) {
        setExistingEmail(values.email);
        return;
      }
      toast.error(
        error.response?.data?.message ?? "Couldn't create your account. Please try again.",
      );
    }
  };

  if (existingEmail) {
    return (
      <>
        <SEOHead title="Account already exists" />
        <div className="flex flex-col items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-full border border-rule">
            <UserRound className="text-ink-muted" size={22} strokeWidth={1.5} />
          </div>
          <h1 className="mt-5 font-display text-3xl text-ink">You already have an account</h1>
          <p className="mt-2 text-sm text-ink-muted">
            <span className="text-ink">{existingEmail}</span> is already registered. Log in
            instead, or use a different email to sign up.
          </p>

          <Button asChild variant="ink" size="lg" className="mt-8 w-full">
            <Link to="/login" state={{ prefillEmail: existingEmail }}>
              Log in instead
              <ArrowRight size={16} />
            </Link>
          </Button>

          <button
            type="button"
            onClick={() => setExistingEmail(null)}
            className="mt-4 text-sm text-ink-muted underline underline-offset-4 hover:text-ink"
          >
            Use a different email
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Create Account" />
      <h1 className="mb-2 font-display text-4xl leading-tight text-ink">Create your account</h1>
      <p className="mb-8 text-sm text-ink-muted">
        Free forever — get your personalised career roadmap.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
        <AuthField label="Full name" htmlFor="fullName" error={errors.fullName?.message}>
          <input
            id="fullName"
            placeholder="Riya Sharma"
            className="w-full min-w-0 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
            {...register("fullName")}
          />
        </AuthField>

        <AuthField label="Email" htmlFor="email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="w-full min-w-0 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
            {...register("email")}
          />
        </AuthField>

        <AuthField
          label="Education level"
          htmlFor="educationLevel"
          error={errors.educationLevel?.message}
        >
          <select
            id="educationLevel"
            defaultValue=""
            className="w-full min-w-0 appearance-none bg-transparent text-sm text-ink focus:outline-none"
            {...register("educationLevel")}
          >
            <option value="" disabled>
              Select your level
            </option>
            {EDUCATION_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
          <ChevronDown size={15} className="shrink-0 text-ink-faint" />
        </AuthField>

        <AuthField label="Password" htmlFor="password" error={errors.password?.message}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 8 characters"
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
          label="Confirm password"
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
          {isSubmitting ? "Creating account…" : "Create account"}
          <ArrowRight size={16} />
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link to="/login" className="text-ink underline underline-offset-4 hover:text-ink/70">
          Log in
        </Link>
      </p>
    </>
  );
}
