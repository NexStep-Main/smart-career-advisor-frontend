import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, LogOut, X } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import ThemeToggle from "@/components/common/ThemeToggle";
import useAuthStore from "@/store/useAuthStore";

const SIDEBAR_COLLAPSED_KEY = "nexstep-sidebar-collapsed";

/**
 * Shell for every authenticated student page: fixed Sidebar + topbar,
 * routed page renders in <Outlet/>. Guide § Reusable Components.
 */
export default function DashboardLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
    } catch {
      return false;
    }
  });
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      } catch {
        // localStorage unavailable (private mode, quota) — collapse state
        // just won't persist across reloads, which is fine.
      }
      return next;
    });
  };

  return (
    <div className="portal-student flex h-screen overflow-hidden bg-background">
      <Sidebar collapsed={collapsed} onToggleCollapse={toggleCollapsed} />

      {/* Mobile sidebar drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 bg-surface shadow-lg">
            <Sidebar mobile onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-6">
          <button
            className="rounded-lg border border-border p-2 md:hidden"
            onClick={() => setMobileNavOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-sm text-slate-600 dark:text-slate-300 sm:inline">
              {user?.fullName ?? "Student"}
            </span>
            <div className="flex size-9 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary-dark">
              {(user?.fullName ?? "S").charAt(0).toUpperCase()}
            </div>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-red-500"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
