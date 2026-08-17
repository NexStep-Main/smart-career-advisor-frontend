import { Outlet } from "react-router-dom";
import Logo from "@/components/common/Logo";
import ThemeToggle from "@/components/common/ThemeToggle";

/** Centered card shell shared by /login, /register and /admin/login. */
export default function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <ThemeToggle className="absolute right-6 top-6" />

      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>

        <div className="rounded-xl border border-border bg-surface p-8 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
