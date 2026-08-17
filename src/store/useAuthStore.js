import { create } from "zustand";
import { persist } from "zustand/middleware";

const REMEMBER_KEY = "nexstep-remember-me";

// "Remember me" unchecked → session dies with the browser tab (sessionStorage).
// Checked (default) → session survives restarts (localStorage). The choice
// has to be resolved per read/write, not once at module load — a plain
// `createJSONStorage(() => ...)` call picks the engine a single time before
// any login has happened, so a real per-login switch needs a hand-rolled
// storage adapter instead.
function getPreferredStorage() {
  return localStorage.getItem(REMEMBER_KEY) === "false" ? sessionStorage : localStorage;
}

const dynamicStorage = {
  getItem: (name) => {
    const raw = getPreferredStorage().getItem(name);
    return raw ? JSON.parse(raw) : null;
  },
  setItem: (name, value) => getPreferredStorage().setItem(name, JSON.stringify(value)),
  removeItem: (name) => getPreferredStorage().removeItem(name),
};

/**
 * Auth session state, persisted so a refresh doesn't log the user out; the
 * axios interceptor in services/api.js reads `token` from here. App.jsx
 * verifies the persisted token against /auth/me on boot (a locally-stored
 * flag doesn't mean the JWT is still valid server-side).
 */
const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // { id, fullName, email, role, educationLevel, stream, quizCompleted }
      token: null,
      isAuthenticated: false,

      login: (user, token, rememberMe = true) => {
        // A real login always wins over a leftover dev-bypass session (see
        // AdminLoginPage's "skip login" button) — otherwise the stale flag
        // makes api.js's 401 interceptor swallow errors it shouldn't.
        localStorage.removeItem("sca-dev-bypass");
        localStorage.setItem(REMEMBER_KEY, String(rememberMe));
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem(REMEMBER_KEY);
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateProfile: (data) =>
        set((state) => ({ user: state.user ? { ...state.user, ...data } : state.user })),

      // Refreshes the user object without touching token/rememberMe — used
      // by the App.jsx boot-time session check (GET /auth/me).
      setUser: (user) => set({ user, isAuthenticated: true }),
    }),
    { name: "nexstep-auth", storage: dynamicStorage },
  ),
);

export default useAuthStore;
