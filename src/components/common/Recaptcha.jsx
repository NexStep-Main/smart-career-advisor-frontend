import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const SCRIPT_SRC = "https://www.google.com/recaptcha/api.js?render=explicit";

let scriptPromise = null;
function loadRecaptchaScript() {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    if (window.grecaptcha?.render) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => window.grecaptcha.ready(resolve);
    script.onerror = () => reject(new Error("Failed to load reCAPTCHA"));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/**
 * reCAPTCHA v2 Invisible — no checkbox in the form; Google renders its
 * "protected by reCAPTCHA" badge fixed to the page's bottom-right corner
 * instead (required by Google's terms whenever the badge itself isn't
 * hidden via CSS, so we leave it visible rather than suppressing it).
 * Verification runs on submit via `execute()`, not on page load. Entirely
 * absent when VITE_RECAPTCHA_SITE_KEY isn't set — see Backend/.env.example
 * / utils/verifyRecaptcha.js for the matching server-side skip. Shared
 * between the student and admin login pages — one reCAPTCHA site key
 * covers both, same origin.
 *
 * Register the site at google.com/recaptcha/admin as "reCAPTCHA v2 —
 * Invisible reCAPTCHA badge", not the checkbox variant.
 */
const Recaptcha = forwardRef(function Recaptcha(_props, ref) {
  const containerRef = useRef(null);
  const widgetId = useRef(null);
  const pendingResolve = useRef(null);

  useImperativeHandle(ref, () => ({
    // Resolves with the token, or null if reCAPTCHA isn't configured/loaded
    // yet, or if verification expires/errors before completing.
    execute: () =>
      new Promise((resolve) => {
        if (widgetId.current === null) {
          resolve(null);
          return;
        }
        pendingResolve.current = resolve;
        window.grecaptcha.execute(widgetId.current);
      }),
    reset: () => {
      if (widgetId.current !== null) window.grecaptcha.reset(widgetId.current);
    },
  }));

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;

    const settle = (value) => {
      pendingResolve.current?.(value);
      pendingResolve.current = null;
    };

    loadRecaptchaScript()
      .then(() => {
        if (cancelled || !containerRef.current || widgetId.current !== null) return;
        widgetId.current = window.grecaptcha.render(containerRef.current, {
          sitekey: SITE_KEY,
          size: "invisible",
          badge: "bottomright",
          callback: settle,
          "expired-callback": () => settle(null),
          "error-callback": () => settle(null),
        });
      })
      .catch(() => {
        // Script host blocked/offline — execute() above just resolves null
        // (widgetId stays unset), and the login submit handler treats a
        // missing token as "required".
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!SITE_KEY) return null;

  return <div ref={containerRef} />;
});

export default Recaptcha;
