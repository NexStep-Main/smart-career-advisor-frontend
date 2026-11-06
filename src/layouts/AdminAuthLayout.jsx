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
    <div className="portal-admin dark relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12">
      {/* Soft admin-accent glow behind the card — depth without a hard
          gradient block, per the .bg-grain comment's reasoning in index.css. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-admin-accent/10 blur-[110px]"
      />
      <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 opacity-[0.03]" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" admin />
        </div>

        <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-8 shadow-2xl shadow-black/40">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-admin-accent/70 to-transparent" />
          <Outlet />
        </div>
      </div>
    </div>
  );
}
