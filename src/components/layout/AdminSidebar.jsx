import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Route,
  Users,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Logo from "@/components/common/Logo";
import useAdminAuthStore from "@/store/useAdminAuthStore";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Careers", to: "/admin/careers", icon: Briefcase },
  { label: "Roadmaps", to: "/admin/roadmaps", icon: Route },
  { label: "Students", to: "/admin/students", icon: Users },
];

const SUPERADMIN_NAV_ITEM = { label: "Admins", to: "/admin/admins", icon: ShieldCheck };

/**
 * Left nav for the authenticated admin shell. Mirrors components/layout/Sidebar.jsx,
 * including the `mobile` prop needed so it renders inside AdminLayout's drawer, and
 * the same collapse-to-icon-rail behavior (desktop only — the mobile drawer is
 * already an overlay and never collapses).
 */
export default function AdminSidebar({ mobile = false, onNavigate, collapsed = false, onToggleCollapse }) {
  const isSuperadmin = useAdminAuthStore((state) => state.user?.role === "superadmin");
  const navItems = isSuperadmin ? [...NAV_ITEMS, SUPERADMIN_NAV_ITEM] : NAV_ITEMS;

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
          <span className="font-heading text-lg font-bold text-admin-accent">N</span>
        ) : (
          <>
            <Logo size="md" to="/admin/dashboard" admin />
            <span className="rounded-md bg-admin-accent-light px-2 py-0.5 text-[11px] font-semibold text-admin-accent-dark">
              {isSuperadmin ? "Superadmin" : "Admin"}
            </span>
          </>
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
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center rounded-lg py-2.5 text-sm font-medium transition-colors",
                collapsed ? "justify-center px-2" : "gap-3 px-3",
                isActive
                  ? "bg-admin-accent-light text-admin-accent-dark"
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
