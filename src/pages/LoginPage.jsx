import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import AuthField from "@/components/common/AuthField";
import SEOHead from "@/components/common/SEOHead";
import useAuthStore from "@/store/useAuthStore";
import { loginRequest } from "@/services/auth";
import { loginSchema } from "@/utils/schemas";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: location.state?.prefillEmail ?? "" },
  });

  const onSubmit = async (values) => {
    try {
      const { data } = await loginRequest(values);
      login(data.data.user, data.data.token, values.rememberMe ?? true);
      navigate(location.state?.from?.pathname ?? "/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Invalid email or password.");
    }
  };

  return (
    <>
      <SEOHead title="Login" />
      <h1 className="mb-2 font-display text-4xl leading-tight text-ink">Welcome back</h1>
      <p className="mb-8 text-sm text-ink-muted">Log in to continue your career journey.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
        <AuthField label="Email" htmlFor="email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="w-full min-w-0 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
            {...register("email")}
          />
        </AuthField>

        <AuthField label="Password" htmlFor="password" error={errors.password?.message}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
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

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-ink-muted">
            <input
              type="checkbox"
              className="size-4 rounded-none border-rule"
              {...register("rememberMe")}
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-ink-muted transition-colors hover:text-ink">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="ink" size="lg" disabled={isSubmitting} className="mt-2 w-full">
          {isSubmitting ? "Logging in…" : "Log in"}
          <ArrowRight size={16} />
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-muted">
        Don't have an account?{" "}
        <Link to="/register" className="text-ink underline underline-offset-4 hover:text-ink/70">
          Sign up
        </Link>
      </p>
    </>
  );
}
