import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Briefcase, CornerDownLeft, Layers, FlaskConical, Lightbulb, LogOut, Moon, Orbit, Search } from "lucide-react";
import useAllCareers from "@/hooks/useAllCareers";
import useThemeStore from "@/store/useThemeStore";
import { NAV_ITEMS } from "@/lib/navItems";
import { cn } from "@/lib/utils";

const EXPLORER_VIEWS = [
  { label: "Swipe careers", to: "/careers?view=swipe", icon: Layers, keywords: "tinder like skip" },
  { label: "Skill Lab", to: "/careers?view=skills", icon: FlaskConical, keywords: "match skills" },
  { label: "Career Universe", to: "/careers?view=universe", icon: Orbit, keywords: "map planets" },
  { label: "Salary Race", to: "/careers?view=race", icon: BarChart3, keywords: "pay money earn" },
  { label: "Request a career", to: "/careers?view=wishlist", icon: Lightbulb, keywords: "suggest wishlist vote" },
];

/** 3 = starts with the query, 2 = a word starts with it, 1 = contains it, 0 = no match. */
function score(text, q) {
  const t = text.toLowerCase();
  if (t.startsWith(q)) return 3;
  if (t.split(/[\s/()-]+/).some((w) => w.startsWith(q))) return 2;
  return t.includes(q) ? 1 : 0;
}

/**
 * Ctrl/Cmd+K quick finder: jump to any page, explorer mode or career, or run
 * a quick action, entirely from the keyboard. Controlled by the layout, which
 * owns the shortcut and the top bar button.
 */
export default function CommandPalette({ open, onClose, onLogout }) {
  const navigate = useNavigate();
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const { data: careers = [] } = useAllCareers();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef(null);

  // Freeze the page behind the palette (same reasoning as the spin wheel).
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const scrollbar = window.innerWidth - html.clientWidth;
    const prev = { overflow: html.style.overflow, paddingRight: html.style.paddingRight };
    html.style.overflow = "hidden";
    if (scrollbar > 0) html.style.paddingRight = `${scrollbar}px`;
    return () => {
      html.style.overflow = prev.overflow;
      html.style.paddingRight = prev.paddingRight;
    };
  }, [open]);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const go = (to) => () => navigate(to);

    const pages = NAV_ITEMS.map((n) => ({ id: `page-${n.to}`, group: "Pages", label: n.label, icon: n.icon, run: go(n.to), keywords: "" }));
    const views = EXPLORER_VIEWS.map((v) => ({ id: `view-${v.to}`, group: "Explore", label: v.label, icon: v.icon, run: go(v.to), keywords: v.keywords }));
    const actions = [
      { id: "act-theme", group: "Actions", label: "Switch light / dark theme", icon: Moon, run: toggleTheme, keywords: "dark mode light theme" },
      { id: "act-logout", group: "Actions", label: "Log out", icon: LogOut, run: onLogout, keywords: "sign out" },
    ];
    const careerItems = careers.map((c) => ({
      id: `career-${c.id}`,
      group: "Careers",
      label: c.title,
      hint: c.domain,
      icon: Briefcase,
      run: go(`/careers/${c.id}`),
      keywords: `${c.domain} ${(c.skills ?? []).join(" ")}`,
    }));

    if (!q) return [...pages, ...views, ...actions];

    const rank = (it) => Math.max(score(it.label, q) * 2, it.keywords ? score(it.keywords, q) : 0);
    return [...pages, ...views, ...actions, ...careerItems]
      .map((it) => ({ it, r: rank(it) }))
      .filter((x) => x.r > 0)
      .sort((a, b) => b.r - a.r)
      .slice(0, 10)
      .map((x) => x.it);
  }, [query, careers, navigate, toggleTheme, onLogout]);

  const safeActive = Math.min(active, Math.max(items.length - 1, 0));

  const run = (item) => {
    onClose();
    item.run();
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((safeActive + 1) % Math.max(items.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((safeActive - 1 + items.length) % Math.max(items.length, 1));
    } else if (e.key === "Enter" && items[safeActive]) {
      e.preventDefault();
      run(items[safeActive]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  // Keep the highlighted row in view while arrowing through a long list.
  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [safeActive, items]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Quick finder"
      className="fixed inset-0 z-[60] flex items-start justify-center overscroll-contain bg-night/80 p-4 pt-[12vh]"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-3xl border-2 border-ink bg-surface shadow-pop-lg"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b-2 border-ink px-4">
          <Search size={18} className="shrink-0 text-ink-faint" />
          <input
            autoFocus
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={items[safeActive]?.id}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search pages, careers, actions…"
            className="h-14 w-full bg-transparent text-base font-semibold text-ink placeholder:text-ink-faint focus:outline-none"
          />
          <kbd className="hidden shrink-0 rounded-lg border-2 border-ink/30 px-1.5 py-0.5 text-[10px] font-bold text-ink-faint sm:block">ESC</kbd>
        </div>

        <ul id="palette-list" ref={listRef} role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
          {items.length === 0 && <li className="px-4 py-8 text-center text-sm font-semibold text-ink-muted">Nothing matches "{query}".</li>}
          {items.map((item, i) => {
            const showGroup = i === 0 || items[i - 1].group !== item.group;
            const Icon = item.icon;
            const isActive = i === safeActive;
            return (
              <li key={item.id} role="presentation">
                {showGroup && <div className="px-3 pb-1 pt-3 text-[11px] font-bold uppercase tracking-wider text-ink-faint">{item.group}</div>}
                <button
                  id={item.id}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => run(item)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors",
                    isActive ? "bg-sunny text-night" : "text-ink",
                  )}
                >
                  <Icon size={17} className="shrink-0" />
                  <span className="min-w-0 flex-1 truncate text-sm font-bold">{item.label}</span>
                  {item.hint && <span className={cn("shrink-0 text-xs font-semibold", isActive ? "text-night/70" : "text-ink-faint")}>{item.hint}</span>}
                  {isActive && <CornerDownLeft size={14} className="shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4 border-t-2 border-dashed border-rule px-4 py-2 text-[11px] font-semibold text-ink-faint">
          <span>↑↓ to move</span>
          <span>Enter to open</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
