import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NAV_ITEMS } from "@/lib/navItems";
import Logo from "@/components/common/Logo";
import { cn } from "@/lib/utils";

/**
 * Left nav for the authenticated dashboard shell (desktop only; phones get
 * the bottom tab bar in DashboardLayout). Collapsible to an icon rail.
 */
export default function Sidebar({ collapsed = false, onToggleCollapse }) {
  return (
    <aside
      className={cn(
        "hidden h-full shrink-0 flex-col border-r-2 border-ink bg-surface transition-[width] duration-200 md:flex",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b-2 border-dashed border-rule",
          collapsed ? "justify-center px-2" : "justify-between px-5",
        )}
      >
        {collapsed ? <Logo size="sm" to="/dashboard" className="[&>span:last-child]:hidden" /> : <Logo size="md" />}
        {!collapsed && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="rounded-full border-2 border-transparent p-1.5 text-ink-muted hover:border-ink hover:bg-sunny/40 hover:text-ink"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          type="button"
          onClick={onToggleCollapse}
          className="flex items-center justify-center border-b-2 border-dashed border-rule py-2 text-ink-muted hover:bg-sunny/40 hover:text-ink"
          aria-label="Expand sidebar"
        >
          <ChevronRight size={16} />
        </button>
      )}

      <nav className="flex flex-1 flex-col gap-2 p-4">
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center rounded-2xl border-2 py-2.5 text-sm font-bold transition-all",
                collapsed ? "justify-center px-2" : "gap-3 px-3.5",
                isActive
                  ? "border-ink bg-sunny text-night shadow-pop-sm"
                  : "border-transparent text-ink-muted hover:border-ink/30 hover:bg-sunny/30 hover:text-ink",
              )
            }
          >
            <Icon size={19} strokeWidth={2.2} className="shrink-0" />
            {collapsed ? (
              <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-full border-2 border-ink bg-surface px-3 py-1 text-xs font-bold text-ink opacity-0 shadow-pop-sm transition-opacity duration-150 group-hover:opacity-100">
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
