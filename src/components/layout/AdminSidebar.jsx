import { NavLink } from "react-router-dom";
import { LayoutDashboard, Briefcase, Route, Users, ShieldCheck } from "lucide-react";
import Logo from "@/components/common/Logo";
import useAuthStore from "@/store/useAuthStore";
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
 * including the `mobile` prop needed so it renders inside AdminLayout's drawer.
 */
export default function AdminSidebar({ mobile = false, onNavigate }) {
  const isSuperadmin = useAuthStore((state) => state.user?.role === "superadmin");
  const navItems = isSuperadmin ? [...NAV_ITEMS, SUPERADMIN_NAV_ITEM] : NAV_ITEMS;

  return (
    <aside
      className={cn(
        "w-64 shrink-0 flex-col border-r border-border bg-surface",
        mobile ? "flex" : "hidden md:flex",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-6">
        <Logo size="md" to="/admin/dashboard" admin />
        <span className="rounded-md bg-admin-accent-light px-2 py-0.5 text-[11px] font-semibold text-admin-accent-dark">
          Admin
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-admin-accent-light text-admin-accent-dark"
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
