import { NavLink } from "react-router-dom";
import { LayoutDashboard, Compass, Sparkles, Scale, Bookmark, User } from "lucide-react";
import Logo from "@/components/common/Logo";
import { cn } from "@/lib/utils";

// Routes match the app's existing registered paths (App.jsx). See
// "Route naming" in the migration punch-list for the Guide's proposed names.
const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Explore", to: "/careers", icon: Compass },
  { label: "Recommendations", to: "/recommendations", icon: Sparkles },
  { label: "Compare", to: "/compare", icon: Scale },
  { label: "Saved", to: "/bookmarks", icon: Bookmark },
  { label: "Profile", to: "/profile", icon: User },
];

/**
 * Left nav for the authenticated dashboard shell. Rendered in two places:
 * the persistent desktop rail (hidden below `md`) and inside the mobile
 * drawer (DashboardLayout), which is only ever mounted when open — so it
 * must always render as flex there, never `hidden`.
 */
export default function Sidebar({ mobile = false, onNavigate }) {
  return (
    <aside
      className={cn(
        "w-64 shrink-0 flex-col border-r border-border bg-surface",
        mobile ? "flex" : "hidden md:flex",
      )}
    >
      <div className="flex h-16 items-center border-b border-border px-6">
        <Logo size="md" />
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-light text-primary-dark"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-50",
              )
            }
          >
            <Icon size={18} strokeWidth={1.8} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
