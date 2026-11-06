import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Search } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { NAV_ITEMS } from "@/lib/navItems";
import StreakChip from "@/components/layout/StreakChip";
import CommandPalette from "@/components/layout/CommandPalette";
import Logo from "@/components/common/Logo";
import Avatar from "@/components/common/Avatar";
import ThemeToggle from "@/components/common/ThemeToggle";
import useAuthStore from "@/store/useAuthStore";
import { useDailyCheckIn } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";

const SIDEBAR_COLLAPSED_KEY = "nexstep-sidebar-collapsed";

/**
 * Shell for every authenticated student page: sidebar + top bar on desktop,
 * top bar + bottom tab bar on phones. The routed page renders in <Outlet/>.
 * Opening the shell also registers today's visit for the streak.
 */
export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
    } catch {
      return false;
    }
  });
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  useDailyCheckIn();

  // Ctrl/Cmd+K opens the quick finder from anywhere in the portal.
  const [paletteOpen, setPaletteOpen] = useState(false);
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
        // localStorage unavailable (private mode): collapse state just won't persist.
      }
      return next;
    });
  };

  return (
    <div className="portal-student flex h-screen overflow-hidden bg-background">
      <Sidebar collapsed={collapsed} onToggleCollapse={toggleCollapsed} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b-2 border-ink bg-surface px-4 sm:px-6">
          <div className="md:hidden">
            <Logo size="sm" to="/dashboard" />
          </div>

          <div className="ml-auto flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Open quick finder (Ctrl+K)"
              className="flex items-center gap-2 rounded-full border-2 border-ink bg-surface px-3 py-1.5 text-sm font-bold text-ink-muted transition-all hover:bg-sunny/30 hover:text-ink"
            >
              <Search size={15} />
              <span className="hidden lg:inline">Search</span>
              <kbd className="hidden rounded-md border border-ink/30 px-1 text-[10px] lg:inline">Ctrl K</kbd>
            </button>
            <StreakChip />
            <span className="hidden text-sm font-bold text-ink sm:inline">{user?.fullName ?? "Student"}</span>
            <Avatar name={user?.fullName} avatar={user?.avatar} size={36} />
            <ThemeToggle className="size-9 rounded-full border-2 border-ink bg-surface text-ink hover:bg-sunny/40 hover:text-ink dark:hover:bg-sunny/20" />
            <button
              onClick={handleLogout}
              aria-label="Log out"
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-bold text-ink-muted hover:bg-bubblegum/20 hover:text-ink"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto p-4 pb-24 sm:p-6 md:pb-6">
          <Outlet />
        </main>

        {/* Phone navigation: bottom tab bar instead of a drawer, so every
            section is one thumb-tap away. */}
        <nav
          aria-label="Main"
          className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t-2 border-ink bg-surface px-1 pb-[env(safe-area-inset-bottom)] md:hidden"
        >
          {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex min-w-0 flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-bold transition-colors",
                  isActive ? "text-grape dark:text-primary" : "text-ink-muted",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "flex h-7 w-12 items-center justify-center rounded-full border-2 transition-all",
                      isActive ? "border-ink bg-sunny text-night shadow-pop-sm" : "border-transparent",
                    )}
                  >
                    <Icon size={18} strokeWidth={2.2} />
                  </span>
                  <span className="truncate">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onLogout={handleLogout} />
    </div>
  );
}
