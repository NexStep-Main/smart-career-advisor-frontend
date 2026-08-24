import { create } from "zustand";
import { persist } from "zustand/middleware";

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

      login: (user, token) => set({ user, token, isAuthenticated: true }),

      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      setUser: (user) => set({ user, isAuthenticated: true }),
    }),
    { name: "nexstep-admin-auth" },
  ),
);

export default useAdminAuthStore;
