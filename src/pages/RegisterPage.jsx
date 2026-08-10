import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, UserPlus } from "lucide-react";
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
      login(data.user, data.token);
      navigate("/onboarding", { replace: true });
    } catch {
      toast.error("Couldn't create your account. Please try again.");
    }
  };

  return (
    <>
      <SEOHead title="Create Account" />
      <h1 className="mb-1 font-heading text-2xl font-bold text-slate-900">Create your account</h1>
      <p className="mb-6 text-sm text-slate-500">
        Free forever — get your personalised career roadmap.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Riya Sharma" error={!!errors.name} {...register("name")} />
          <FormError message={errors.name?.message} />
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
            className="h-11 w-full rounded-lg border border-border bg-surface px-4 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
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
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 hover:text-slate-600"
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

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
}
