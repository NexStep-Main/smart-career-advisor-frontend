import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Eye, EyeOff, ShieldCheck, User, Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import FormError from "@/components/ui/FormError";
import SEOHead from "@/components/common/SEOHead";
import FadeIn from "@/components/common/FadeIn";
import GoogleSignInButton from "@/components/admin/GoogleSignInButton";
import Recaptcha from "@/components/admin/Recaptcha";
import useAdminAuthStore from "@/store/useAdminAuthStore";
import {
  adminLoginRequest,
  googleAdminLoginRequest,
  getBootstrapStatus,
} from "@/services/adminAuth";
import { adminLoginSchema } from "@/utils/schemas";

const GOOGLE_ENABLED = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);
const RECAPTCHA_ENABLED = Boolean(import.meta.env.VITE_RECAPTCHA_SITE_KEY);

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();
  const login = useAdminAuthStore((state) => state.login);

  // No admin/superadmin account exists yet — send whoever lands here
  // straight to the one-time setup screen instead of a login form that
  // can't possibly succeed.
  const { data: bootstrapStatus, isLoading: checkingSetup } = useQuery({
    queryKey: ["admin", "bootstrapStatus"],
    queryFn: () => getBootstrapStatus().then((res) => res.data.data),
  });

  useEffect(() => {
    if (bootstrapStatus?.needsSetup) navigate("/admin/setup", { replace: true });
  }, [bootstrapStatus, navigate]);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { rememberMe: true },
  });

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
      const { data } = await adminLoginRequest({ ...values, recaptchaToken });
      login(data.data.user, data.data.token, values.rememberMe ?? true);
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Invalid username or password.");
      // reCAPTCHA tokens are single-use — a failed attempt needs a fresh one.
      recaptchaRef.current?.reset();
    }
  };

  const handleGoogleCredential = async (credential) => {
    setGoogleLoading(true);
    try {
      const { data } = await googleAdminLoginRequest(credential);
      login(data.data.user, data.data.token, getValues("rememberMe") ?? true);
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Google sign-in failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  if (checkingSetup || bootstrapStatus?.needsSetup) return null;

  return (
    <>
      <SEOHead title="Admin Login" />

      <FadeIn>
        <div className="mb-6 flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-admin-accent/30 bg-admin-accent-light">
            <ShieldCheck className="text-admin-accent" size={20} strokeWidth={1.8} />
          </span>
          <div>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-slate-500">
              Console / Sign in
            </span>
            <h1 className="font-display text-2xl text-slate-900 dark:text-slate-50">
              Admin Sign In
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Authorized personnel only</p>
          </div>
        </div>
      </FadeIn>

      {GOOGLE_ENABLED && (
        <FadeIn delay={0.05}>
          <div className="mb-6 flex flex-col gap-4">
            <GoogleSignInButton onCredential={handleGoogleCredential} disabled={googleLoading} />
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                Or
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>
          </div>
        </FadeIn>
      )}

      <FadeIn delay={0.1}>
        {/* eslint-disable-next-line react-hooks/refs -- recaptchaRef.current is only read inside onSubmit's async body (on the submit event), never during this render */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              />
              <Input
                id="username"
                placeholder="admin-username"
                autoComplete="username"
                error={!!errors.username}
                className="pl-10"
                {...register("username")}
              />
            </div>
            <FormError message={errors.username?.message} />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                error={!!errors.password}
                className="pl-10 pr-11"
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

          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              className="size-4 rounded border-border accent-admin-accent"
              {...register("rememberMe")}
            />
            Keep me signed in on this device
          </label>

          {/* Invisible — renders nothing inline, Google's own badge floats
              fixed at the page's bottom-right corner. */}
          {RECAPTCHA_ENABLED && <Recaptcha ref={recaptchaRef} />}

          <Button
            type="submit"
            variant="admin"
            disabled={isSubmitting || googleLoading}
            className="mt-2 w-full"
          >
            {isSubmitting ? "Signing in…" : "Sign in to Admin Panel"}
            {!isSubmitting && <ArrowRight size={16} />}
          </Button>
        </form>
      </FadeIn>

      <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
        This area is restricted to authorized admins only.
      </p>
    </>
  );
}
