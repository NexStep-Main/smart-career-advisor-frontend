import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import FormError from "@/components/ui/FormError";
import SEOHead from "@/components/common/SEOHead";
import useAdminAuthStore from "@/store/useAdminAuthStore";
import { adminLoginRequest, getBootstrapStatus } from "@/services/adminAuth";
import { adminLoginSchema } from "@/utils/schemas";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
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
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(adminLoginSchema) });

  const onSubmit = async (values) => {
    try {
      const { data } = await adminLoginRequest(values);
      login(data.data.user, data.data.token);
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Invalid username or password.");
    }
  };

  if (checkingSetup || bootstrapStatus?.needsSetup) return null;

  return (
    <>
      <SEOHead title="Admin Login" />

      <div className="mb-6 flex items-center gap-3">
        <ShieldCheck className="text-admin-accent" size={22} strokeWidth={1.6} />
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

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="admin-username"
            autoComplete="username"
            error={!!errors.username}
            {...register("username")}
          />
          <FormError message={errors.username?.message} />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
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

        <Button type="submit" variant="admin" disabled={isSubmitting} className="mt-2 w-full">
          {isSubmitting ? "Signing in…" : "Sign in to Admin Panel"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
        This area is restricted to authorized admins only.
      </p>
    </>
  );
}
