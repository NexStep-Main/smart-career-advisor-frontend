import { Outlet } from "react-router-dom";
import Logo from "@/components/common/Logo";
import useForceColorScheme from "@/hooks/useForceColorScheme";

/**
 * Dedicated shell for /admin/login and /admin/setup — deliberately not the
 * student AuthLayout. Admin is a different, internal audience: same boxed-
 * card convention the rest of the admin portal uses (Card, forms), the
 * fixed charcoal-and-amber console skin instead of emerald, and no
 * light/dark toggle — the console doesn't have a light mode — so the login
 * screen already looks like the control panel it leads into instead of the
 * public marketing/student shell.
 */
export default function AdminAuthLayout() {
  useForceColorScheme("dark");

  return (
    <div className="portal-admin dark relative flex min-h-screen items-center justify-center bg-background px-6 py-12">
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
