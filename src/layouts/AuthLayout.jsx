import { Outlet } from "react-router-dom";
import Logo from "@/components/common/Logo";
import ThemeToggle from "@/components/common/ThemeToggle";

/** Centered card shell shared by /login, /register and /admin/login. */
export default function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_35%),linear-gradient(to_bottom,_#f8f7fc_0%,_#eef2ff_100%)] px-6 py-12 dark:bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.18),_transparent_35%),linear-gradient(to_bottom,_#0b0a12_0%,_#14131c_100%)]">
      <div className="absolute -left-12 top-14 h-52 w-52 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15" />
      <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-500/10" />
      <ThemeToggle className="absolute right-6 top-6 z-10" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-white/90 p-8 shadow-[0_22px_60px_-28px_rgba(79,70,229,0.42)] ring-1 ring-slate-200/60 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-950/75 dark:shadow-[0_22px_60px_-28px_rgba(99,102,241,0.35)] dark:ring-slate-800/80">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
