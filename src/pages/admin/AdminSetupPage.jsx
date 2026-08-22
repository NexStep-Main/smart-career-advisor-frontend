import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Eye, EyeOff, ShieldPlus } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import FormError from "@/components/ui/FormError";
import SEOHead from "@/components/common/SEOHead";
import useAuthStore from "@/store/useAuthStore";
import { bootstrapSuperadmin, getBootstrapStatus } from "@/services/adminAuth";
import { superadminSetupSchema } from "@/utils/schemas";

/**
 * First-run "startup page" — creates the one and only superadmin account.
 * Only reachable when no superadmin exists yet (see AdminLoginPage's
 * redirect, and the server-side recheck in bootstrapSuperadmin). Anyone
 * landing here after setup is already done gets bounced to /admin/login.
 */
export default function AdminSetupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const { data: bootstrapStatus, isLoading: checkingSetup } = useQuery({
    queryKey: ["admin", "bootstrapStatus"],
    queryFn: () => getBootstrapStatus().then((res) => res.data.data),
  });

  useEffect(() => {
    if (bootstrapStatus && !bootstrapStatus.needsSetup) {
      navigate("/admin/login", { replace: true });
    }
  }, [bootstrapStatus, navigate]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(superadminSetupSchema) });

  const onSubmit = async (values) => {
    try {
      const { fullName, username, email, password } = values;
      const { data } = await bootstrapSuperadmin({ fullName, username, email, password });
      login(data.data.user, data.data.token);
      toast.success("Superadmin account created");
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      const status = error.response?.status;
      if (status === 403) {
        // Someone else finished setup between page load and submit — bounce
        // to login instead of leaving the form silently unusable.
        toast.error(error.response.data.message);
        navigate("/admin/login", { replace: true });
        return;
      }
      const fieldErrors = error.response?.data?.error?.fieldErrors;
      if (fieldErrors) {
        for (const [field, messages] of Object.entries(fieldErrors)) {
          if (messages?.[0]) setError(field, { type: "server", message: messages[0] });
        }
        return;
      }
      toast.error(error.response?.data?.message ?? "Couldn't create the superadmin account.");
    }
  };

  if (checkingSetup || (bootstrapStatus && !bootstrapStatus.needsSetup)) return null;

  return (
    <>
      <SEOHead title="Admin Setup" />

      <div className="mb-6 flex items-center gap-3">
        <ShieldPlus className="text-admin-accent" size={22} strokeWidth={1.6} />
        <div>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-slate-500">
            Console / First-run setup
          </span>
          <h1 className="font-display text-2xl text-slate-900 dark:text-slate-50">
            Create the superadmin account
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            One-time setup — this account can create every other admin.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" error={!!errors.fullName} {...register("fullName")} />
          <FormError message={errors.fullName?.message} />
        </div>

        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="e.g. jane_admin"
            autoComplete="username"
            error={!!errors.username}
            {...register("username")}
          />
          <FormError message={errors.username?.message} />
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

        <Button type="submit" variant="admin" disabled={isSubmitting} className="mt-2 w-full">
          {isSubmitting ? "Creating…" : "Create superadmin"}
        </Button>
      </form>
    </>
  );
}
