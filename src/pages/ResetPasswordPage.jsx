import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Eye, EyeOff, KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import FormError from "@/components/ui/FormError";
import SEOHead from "@/components/common/SEOHead";
import { resetPasswordRequest } from "@/services/auth";
import { resetPasswordSchema } from "@/utils/schemas";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (values) => {
    try {
      await resetPasswordRequest(token, values);
      setDone(true);
    } catch (error) {
      toast.error(error.response?.data?.message ?? "This reset link is invalid or has expired.");
    }
  };

  if (done) {
    return (
      <>
        <SEOHead title="Password reset" />
        <div className="flex flex-col items-center text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-accent-green/10">
            <CheckCircle2 className="text-accent-green" size={26} strokeWidth={1.8} />
          </div>
          <h1 className="mt-5 font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Password reset
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Your password has been updated. Log in with your new password.
          </p>
          <Button className="mt-8 w-full shadow-[0_12px_24px_-18px_rgba(79,70,229,0.75)]" onClick={() => navigate("/login", { replace: true })}>
            Continue to login
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Reset password" />
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary-light">
          <KeyRound className="text-primary" size={20} strokeWidth={1.8} />
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Set a new password
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Choose something you haven't used before
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div>
          <Label htmlFor="password">New password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              error={!!errors.password}
              className="pr-11"
              autoFocus
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
          <Label htmlFor="confirmPassword">Confirm new password</Label>
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
          {isSubmitting ? "Resetting…" : "Reset password"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Remembered it after all?{" "}
        <Link to="/login" className="font-medium text-primary underline-offset-2 hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
}
