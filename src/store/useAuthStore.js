import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Auth session state. Persisted to localStorage so refresh doesn't log the
 * user out; the axios interceptor in services/api.js reads `token` from here.
 */
const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // { id, name, email, role, educationLevel }
      token: null,
      isAuthenticated: false,

      login: (user, token) => set({ user, token, isAuthenticated: true }),

      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      updateProfile: (data) =>
        set((state) => ({ user: state.user ? { ...state.user, ...data } : state.user })),
    }),
    { name: "sca-auth" }
  )
);

export default useAuthStore;
