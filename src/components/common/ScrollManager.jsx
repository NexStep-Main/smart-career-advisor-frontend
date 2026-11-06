import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * React Router doesn't scroll on navigation, so `/#faq` links landed on the
 * page top and new pages kept the old scroll position. Mount once inside the
 * router: it scrolls to the hash target (waiting a moment for the section to
 * render when arriving from another page) or back to the top otherwise.
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0 });
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    let timer;
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (tries++ < 10) timer = setTimeout(tryScroll, 80);
    };
    timer = setTimeout(tryScroll, 0);
    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}
