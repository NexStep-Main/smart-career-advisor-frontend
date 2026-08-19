import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn, UserPlus, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import FormError from "@/components/ui/FormError";
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
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

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
          <div className="flex size-14 items-center justify-center rounded-full bg-primary-light">
            <UserRound className="text-primary" size={26} strokeWidth={1.8} />
          </div>
          <h1 className="mt-5 font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            You already have an account
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-200">{existingEmail}</span>{" "}
            is already registered. Log in instead, or use a different email to sign up.
          </p>

          <Link
            to="/login"
            state={{ prefillEmail: existingEmail }}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_24px_-18px_rgba(79,70,229,0.75)] transition hover:bg-primary-dark"
          >
            <LogIn size={16} />
            Log in instead
          </Link>

          <button
            type="button"
            onClick={() => setExistingEmail(null)}
            className="mt-4 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 hover:underline dark:text-slate-400 dark:hover:text-slate-200"
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
      <div className="mb-6 text-center">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Free forever — get your personalised career roadmap.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            placeholder="Riya Sharma"
            error={!!errors.fullName}
            {...register("fullName")}
          />
          <FormError message={errors.fullName?.message} />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            error={!!errors.email}
            {...register("email")}
          />
          <FormError message={errors.email?.message} />
        </div>

        <div>
          <Label htmlFor="educationLevel">Education level</Label>
          <select
            id="educationLevel"
            defaultValue=""
            className="h-11 w-full rounded-lg border border-border bg-surface px-4 text-sm text-slate-900 dark:text-slate-50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
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
          <FormError message={errors.educationLevel?.message} />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              error={!!errors.password}
              className="pr-11"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          <FormError message={errors.password?.message} />
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Re-enter password"
            error={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          <FormError message={errors.confirmPassword?.message} />
        </div>

        <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
          <UserPlus size={16} />
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary underline-offset-2 hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
}
