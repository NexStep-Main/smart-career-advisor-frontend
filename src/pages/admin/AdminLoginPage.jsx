import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import FormError from "@/components/ui/FormError";
import SEOHead from "@/components/common/SEOHead";
import useAuthStore from "@/store/useAuthStore";
import { loginRequest } from "@/services/auth";
import { loginSchema } from "@/utils/schemas";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values) => {
    try {
      const { data } = await loginRequest(values);
      if (data.data.user.role !== "admin") {
        toast.error("This account doesn't have admin access.");
        return;
      }
      login(data.data.user, data.data.token);
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Invalid email or password.");
    }
  };

  // Dev-only: view the admin UI with no backend/DB running yet. Every API
  // call will still fail (no data), but the shell, layout and pages render.
  const skipLogin = () => {
    localStorage.setItem("sca-dev-bypass", "1");
    login(
      {
        id: "dev-admin",
        fullName: "Dev Admin",
        email: "dev@local",
        role: "admin",
        educationLevel: null,
        stream: null,
        quizCompleted: false,
      },
      "dev-bypass-token",
    );
    navigate("/admin/dashboard", { replace: true });
  };

  return (
    <>
      <SEOHead title="Admin Login" />

      <div className="mb-6 flex items-center gap-3">
        <ShieldCheck className="text-admin-accent" size={22} strokeWidth={1.6} />
        <div>
          <h1 className="font-display text-2xl text-slate-900 dark:text-slate-50">
            Admin Sign In
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Authorized personnel only</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@smartcareer.com"
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

      {import.meta.env.DEV && (
        <Button type="button" variant="outline" className="mt-3 w-full" onClick={skipLogin}>
          Skip login — view UI (dev, no backend)
        </Button>
      )}

      <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
        This area is restricted to authorized admins only.
      </p>
    </>
  );
}
