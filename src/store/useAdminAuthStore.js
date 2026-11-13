import { create } from "zustand";
import { persist } from "zustand/middleware";

// Own key, separate from useAuthStore's (student) REMEMBER_KEY — an admin's
// "remember me" choice must never affect a student session in the same
// browser, or vice versa.
const REMEMBER_KEY = "nexstep-admin-remember-me";

// "Remember me" unchecked → session dies with the browser tab (sessionStorage).
// Checked (default) → session survives restarts (localStorage). Mirrors
// useAuthStore.js's dynamicStorage exactly — see that file for why this has
// to be resolved per read/write instead of once at module load.
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
 * Admin/superadmin session state — deliberately a SEPARATE store from
 * useAuthStore (student), with its own localStorage key. The two used to
 * share one store/key, which meant logging into one portal in a browser
 * that already had a session for the other silently overwrote it — a
 * student session could vanish because someone set up a superadmin account
 * in the same browser, or an admin tab could get logged out by an
 * unrelated student login elsewhere. Two independent stores make that
 * structurally impossible instead of relying on care at the call site.
 */
const useAdminAuthStore = create(
  persist(
    (set) => ({
      user: null, // { id, fullName, username, email, role }
      token: null,
      isAuthenticated: false,

      login: (user, token, rememberMe = true) => {
        localStorage.setItem(REMEMBER_KEY, String(rememberMe));
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem(REMEMBER_KEY);
        set({ user: null, token: null, isAuthenticated: false });
      },

      setUser: (user) => set({ user, isAuthenticated: true }),
    }),
    { name: "nexstep-admin-auth", storage: dynamicStorage },
  ),
);

export default useAdminAuthStore;
