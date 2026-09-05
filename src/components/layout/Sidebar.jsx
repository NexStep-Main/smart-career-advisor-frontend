import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  Scale,
  Bookmark,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
 * the persistent desktop rail (hidden below `md`, collapsible to an icon
 * rail) and inside the mobile drawer (DashboardLayout), which is only ever
 * mounted when open — so it must always render as flex there, never
 * `hidden`, and never collapsed (a drawer that's already an overlay gains
 * nothing from shrinking further).
 */
export default function Sidebar({ mobile = false, onNavigate, collapsed = false, onToggleCollapse }) {
  return (
    <aside
      className={cn(
        "h-full shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200",
        mobile ? "flex w-64" : "hidden md:flex",
        !mobile && (collapsed ? "w-18" : "w-64"),
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b border-border",
          collapsed ? "justify-center px-2" : "justify-between px-6",
        )}
      >
        {collapsed ? (
          <span className="font-heading text-lg font-bold text-primary">N</span>
        ) : (
          <Logo size="md" />
        )}
        {!mobile && !collapsed && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800/60 dark:hover:text-slate-300"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {!mobile && collapsed && (
        <button
          type="button"
          onClick={onToggleCollapse}
          className="flex items-center justify-center border-b border-border py-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800/60 dark:hover:text-slate-300"
          aria-label="Expand sidebar"
        >
          <ChevronRight size={16} />
        </button>
      )}

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center rounded-lg py-2.5 text-sm font-medium transition-colors",
                collapsed ? "justify-center px-2" : "gap-3 px-3",
                isActive
                  ? "bg-primary-light text-primary-dark"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-50",
              )
            }
          >
            <Icon size={18} strokeWidth={1.8} className="shrink-0" />
            {collapsed ? (
              <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md border border-border bg-surface px-2 py-1 text-xs font-medium text-slate-700 opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 dark:text-slate-200">
                {label}
              </span>
            ) : (
              <span className="truncate">{label}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
