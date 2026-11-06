import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Logo from "@/components/common/Logo";
import ThemeToggle from "@/components/common/ThemeToggle";
import useAuthStore from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

// NOTE: routes match the app's existing registered paths (App.jsx), which
// differ slightly from the Guide's route names (e.g. /careers vs /explore).
const NAV_LINKS = [
  { label: "Explore", to: "/careers" },
  { label: "Take the quiz", to: "/onboarding" },
  { label: "How it works", to: "/#process" },
  { label: "FAQ", to: "/#faq" },
];

const toggleClass =
  "size-10 rounded-full border-2 border-ink bg-surface text-ink hover:bg-sunny/40 hover:text-ink dark:hover:bg-sunny/20";

/** Floating pill navbar shared by the public marketing pages. */
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
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <nav
        className={cn(
          "mx-auto flex h-16 max-w-6xl items-center justify-between rounded-full border-2 border-ink bg-surface/90 px-4 backdrop-blur-md transition-shadow duration-300 sm:px-6",
          scrolled ? "shadow-pop" : "shadow-pop-sm",
        )}
      >
        <Logo size="md" mono />

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="rounded-full px-4 py-2 text-sm font-bold text-ink-muted transition-colors hover:bg-sunny/40 hover:text-ink dark:hover:bg-sunny/20"
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle className={toggleClass} />
          {isAuthenticated ? (
            <Button asChild variant="ink" size="sm">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full px-3 py-2 text-sm font-bold text-ink transition-colors hover:bg-sunny/40 dark:hover:bg-sunny/20"
              >
                Login
              </Link>
              <Button asChild variant="ink" size="sm">
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle className={toggleClass} />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex size-10 items-center justify-center rounded-full border-2 border-ink bg-sunny text-night"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mx-auto mt-3 max-w-6xl rounded-3xl border-2 border-ink bg-surface p-5 shadow-pop md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="rounded-2xl px-4 py-3 font-display text-xl font-medium text-ink hover:bg-sunny/30"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-3 flex flex-col gap-3 border-t-2 border-dashed border-rule pt-5">
              {isAuthenticated ? (
                <Button asChild variant="ink" size="md">
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="inkOutline" size="md">
                    <Link to="/login" onClick={() => setMenuOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button asChild variant="ink" size="md">
                    <Link to="/register" onClick={() => setMenuOpen(false)}>
                      Get Started
                    </Link>
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
