import { useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import AuthField from "@/components/common/AuthField";
import SEOHead from "@/components/common/SEOHead";
import GoogleSignInButton from "@/components/common/GoogleSignInButton";
import Recaptcha from "@/components/common/Recaptcha";
import useAuthStore from "@/store/useAuthStore";
import { applyPendingQuiz } from "@/lib/pendingQuiz";
import { mergeSwipes } from "@/store/useSwipeStore";
import { loginRequest, googleLoginRequest } from "@/services/auth";
import { loginSchema } from "@/utils/schemas";

const GOOGLE_ENABLED = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);
const RECAPTCHA_ENABLED = Boolean(import.meta.env.VITE_RECAPTCHA_SITE_KEY);

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: location.state?.prefillEmail ?? "", rememberMe: true },
  });

  const goToDestination = async () => {
    // Guest quiz answers (taken before logging in) are saved to the account
    // first, and take priority over the default landing spot.
    const applied = await applyPendingQuiz();
    // Careers they right-swiped as a guest become real bookmarks.
    await mergeSwipes();
    const from = location.state?.from;
    const destination = from ? `${from.pathname}${from.search ?? ""}` : applied ? "/recommendations" : "/dashboard";
    navigate(destination, { replace: true });
  };

  const onSubmit = async (values) => {
    // Invisible reCAPTCHA runs on submit, not on page load — execute()
    // resolves once verification completes (usually instant; Google may
    // show its own challenge popup first if the attempt looks suspicious).
    let recaptchaToken = null;
    if (RECAPTCHA_ENABLED) {
      recaptchaToken = await recaptchaRef.current?.execute();
      if (!recaptchaToken) {
        toast.error("CAPTCHA verification failed. Please try again.");
        recaptchaRef.current?.reset();
        return;
      }
    }

    try {
      const { data } = await loginRequest({ ...values, recaptchaToken });
      login(data.data.user, data.data.token, values.rememberMe ?? true);
      await goToDestination();
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Invalid email or password.");
      // reCAPTCHA tokens are single-use — a failed attempt needs a fresh one.
      recaptchaRef.current?.reset();
    }
  };

  const handleGoogleCredential = async (credential) => {
    setGoogleLoading(true);
    try {
      const { data } = await googleLoginRequest(credential);
      login(data.data.user, data.data.token, getValues("rememberMe") ?? true);
      await goToDestination();
    } catch (error) {
      if (error.response?.status === 404) {
        // No account for this Google identity — sign-in never creates one
        // (see Backend's googleLogin); send them to the real registration
        // flow instead, pre-filled with what Google already told us.
        const { email, fullName } = error.response.data.error ?? {};
        toast("No account found — let's get you signed up.");
        navigate("/register", { state: { prefillEmail: email, prefillFullName: fullName } });
        return;
      }
      toast.error(error.response?.data?.message ?? "Google sign-in failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <SEOHead title="Login" />
      <h1 className="mb-2 font-display text-4xl leading-tight text-ink">Welcome back</h1>
      <p className="mb-8 text-sm text-ink-muted">Log in to continue your career journey.</p>

      {GOOGLE_ENABLED && (
        <div className="mb-6 flex flex-col gap-4">
          <GoogleSignInButton
            onCredential={handleGoogleCredential}
            disabled={googleLoading}
            theme="outline"
          />
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-rule" />
            <span className="text-xs uppercase tracking-[0.18em] text-ink-faint">Or</span>
            <span className="h-px flex-1 bg-rule" />
          </div>
        </div>
      )}

      {/* eslint-disable-next-line react-hooks/refs -- recaptchaRef.current is only read inside onSubmit's async body (on the submit event), never during this render */}
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

        {/* Invisible — renders nothing inline, Google's own badge floats
            fixed at the page's bottom-right corner. */}
        {RECAPTCHA_ENABLED && <Recaptcha ref={recaptchaRef} />}

        <Button
          type="submit"
          variant="ink"
          size="lg"
          disabled={isSubmitting || googleLoading}
          className="mt-2 w-full"
        >
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
