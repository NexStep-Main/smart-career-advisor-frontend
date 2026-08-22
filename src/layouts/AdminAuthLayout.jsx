import { Outlet } from "react-router-dom";
import Logo from "@/components/common/Logo";
import ThemeToggle from "@/components/common/ThemeToggle";

/**
 * Dedicated shell for /admin/login — deliberately not the student AuthLayout.
 * Admin is a different, internal audience: same boxed-card convention the
 * rest of the admin portal uses (Card, forms), steel blue accent instead of
 * emerald, so the login screen already looks like the control panel it leads
 * into instead of the public marketing/student shell.
 */
export default function AdminAuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <ThemeToggle className="absolute right-6 top-6" />

      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" admin />
        </div>

        <div className="rounded-xl border border-border bg-surface p-8 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
