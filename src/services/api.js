import axios from "axios";
import useAuthStore from "@/store/useAuthStore";
import { BADGE_EVENT } from "@/lib/badges";

/** Base axios instance — all service modules import this. */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Auto-attach JWT token from the auth store.
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Log the user out on a 401 so stale tokens don't loop forever.
api.interceptors.response.use(
  (response) => {
    // Any action can earn a badge (saving a career, finishing a phase, the
    // quiz...). The server reports it as `newBadges`; hand it to the UI.
    const newBadges = response.data?.data?.newBadges;
    if (Array.isArray(newBadges) && newBadges.length > 0) {
      window.dispatchEvent(new CustomEvent(BADGE_EVENT, { detail: newBadges }));
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

export default api;
