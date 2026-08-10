import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { GraduationCap, Menu, X } from "lucide-react";
import Button from "@/components/ui/Button";
import useAuthStore from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

// NOTE: routes match the app's existing registered paths (App.jsx), which
// differ slightly from the Guide's route names (e.g. /careers vs /explore).
// See "Route naming" in the migration punch-list.
const NAV_LINKS = [
  { label: "Explore", to: "/careers" },
  { label: "How it works", to: "/#process" },
  { label: "FAQ", to: "/#faq" },
];

/** Sticky, auth-aware top navbar shared by the public marketing pages. */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors",
        scrolled ? "bg-surface/90 shadow-sm backdrop-blur-md" : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-heading text-lg font-bold text-slate-900">
          <GraduationCap className="text-primary" size={24} />
          Smart Career Advisor
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="text-sm text-slate-600 transition-colors hover:text-slate-900"
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <Button asChild size="sm">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Link to="/login" className="text-sm text-slate-600 hover:text-slate-900">
                Login
              </Link>
              <Button asChild size="sm">
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center justify-center rounded-lg border border-border p-2 md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-border bg-surface px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className="text-sm text-slate-600" onClick={() => setMenuOpen(false)}>
                {link.label}
              </NavLink>
            ))}
            <div className="flex flex-col gap-2 border-t border-border pt-4">
              {isAuthenticated ? (
                <Button asChild size="sm">
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link to="/register" onClick={() => setMenuOpen(false)}>Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
