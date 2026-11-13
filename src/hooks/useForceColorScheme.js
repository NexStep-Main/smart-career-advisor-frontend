import { useEffect } from "react";

/**
 * Forces `color-scheme` on <html> while a component is mounted, restoring
 * whatever value was there before on unmount. The admin console is always
 * dark regardless of the site-wide theme (see AdminAuthLayout/AdminLayout),
 * but that's applied via a `.dark` class scoped to a nested div — <html>
 * itself still reports `color-scheme: light` from :root. Browsers use that
 * root-level value to decide whether to run their own automatic dark-mode
 * repaint on a page, and can misfire on a subtree that's already manually
 * dark-themed, producing inconsistent/inverted colors. Setting it here too
 * stops that heuristic from ever kicking in on admin routes.
 */
export default function useForceColorScheme(scheme) {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.colorScheme;
    root.style.colorScheme = scheme;
    return () => {
      root.style.colorScheme = previous;
    };
  }, [scheme]);
}
