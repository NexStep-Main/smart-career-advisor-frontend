import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, LogOut, X } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import useAdminAuthStore from "@/store/useAdminAuthStore";
import useForceColorScheme from "@/hooks/useForceColorScheme";

const SIDEBAR_COLLAPSED_KEY = "nexstep-admin-sidebar-collapsed";

/**
 * Shell for every authenticated admin page. Mirrors layouts/DashboardLayout.jsx,
 * except the admin portal is a fixed dark "command console" — no light/dark
 * toggle here, and the `dark` class is forced on regardless of the
 * site-wide theme preference so every shared component's existing dark:
 * styling resolves correctly against the charcoal admin tokens (see
 * .portal-admin in styles/index.css).
 */
export default function AdminLayout() {
  useForceColorScheme("dark");

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
    } catch {
      return false;
    }
  });
  const { user, logout } = useAdminAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
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
    <div className="portal-admin dark flex h-screen overflow-hidden bg-background">
      <AdminSidebar collapsed={collapsed} onToggleCollapse={toggleCollapsed} />

      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 bg-surface shadow-lg">
            <AdminSidebar mobile onNavigate={() => setMobileNavOpen(false)} />
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
              {user?.fullName ?? "Admin"}
            </span>
            <div className="flex size-9 items-center justify-center rounded-full border border-border font-display text-sm text-slate-900 dark:text-slate-50">
              {(user?.fullName ?? "A").charAt(0).toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-red-500"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
