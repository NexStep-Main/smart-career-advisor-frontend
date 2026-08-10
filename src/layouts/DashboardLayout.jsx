import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, LogOut, X } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import useAuthStore from "@/store/useAuthStore";

/**
 * Shell for every authenticated student page: fixed Sidebar + topbar,
 * routed page renders in <Outlet/>. Guide § Reusable Components.
 */
export default function DashboardLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      {/* Mobile sidebar drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMobileNavOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 bg-surface shadow-lg">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-6">
          <button
            className="rounded-lg border border-border p-2 md:hidden"
            onClick={() => setMobileNavOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-sm text-slate-600 sm:inline">
              {user?.name ?? "Student"}
            </span>
            <div className="flex size-9 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary-dark">
              {(user?.name ?? "S").charAt(0).toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
