import { useEffect, useRef, useState } from "react";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

let scriptPromise = null;
function loadGoogleScript() {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Failed to load Google Identity Services"));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/**
 * Renders Google's own "Sign in with Google" button (via Google Identity
 * Services, loaded on demand — not an npm package, same as the reCAPTCHA
 * widget). Entirely absent when VITE_GOOGLE_CLIENT_ID isn't set, so the
 * admin login page degrades to username/password-only with zero code
 * changes once the env var lands (see Backend/.env.example).
 *
 * `onCredential` receives the signed ID token JWT string straight from
 * Google's callback — the caller is responsible for sending it to the
 * backend, which is the only place it's actually verified.
 */
export default function GoogleSignInButton({ onCredential, disabled }) {
  const buttonRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    let cancelled = false;

    loadGoogleScript()
      .then(() => {
        if (cancelled) return;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => onCredential(response.credential),
        });
        setReady(true);
      })
      .catch(() => {
        // Network hiccup or the script host is blocked — the button just
        // never appears; username/password login still works untouched.
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onCredential is stable from the caller
  }, []);

  useEffect(() => {
    if (!ready || !buttonRef.current) return;
    window.google.accounts.id.renderButton(buttonRef.current, {
      type: "standard",
      theme: "filled_black",
      size: "large",
      shape: "pill",
      width: 320,
      logo_alignment: "center",
    });
  }, [ready]);

  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <div
      className={disabled ? "pointer-events-none opacity-50" : ""}
      aria-disabled={disabled}
    >
      <div ref={buttonRef} className="flex justify-center" />
    </div>
  );
}
