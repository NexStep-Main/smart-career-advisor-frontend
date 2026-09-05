import { Outlet } from "react-router-dom";
import Logo from "@/components/common/Logo";
import ThemeToggle from "@/components/common/ThemeToggle";

/**
 * Centered shell shared by /login, /register and /admin/login. Editorial
 * register — paper background, mono wordmark, a hairline rule standing in
 * for the old boxed card — so the auth flow reads as a continuation of the
 * landing page rather than a generic dark SaaS panel.
 */
export default function AuthLayout() {
  return (
    <div className="portal-student relative flex min-h-screen items-center justify-center bg-paper px-6 py-12">
      <ThemeToggle className="absolute right-6 top-6 rounded-none border-rule text-ink-muted hover:bg-transparent hover:text-ink" />

      <div className="w-full max-w-md">
        <div className="mb-10 flex justify-center">
          <Logo size="lg" mono />
        </div>

        <div className="border-t border-rule pt-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
