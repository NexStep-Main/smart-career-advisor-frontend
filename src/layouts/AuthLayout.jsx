import { Link, Outlet } from "react-router-dom";
import { GraduationCap } from "lucide-react";

/** Centered card shell shared by /login and /register. */
export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-8 flex items-center justify-center gap-2 font-heading text-lg font-bold text-slate-900"
        >
          <GraduationCap className="text-primary" size={24} />
          Smart Career Advisor
        </Link>

        <div className="rounded-xl border border-border bg-surface p-8 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
