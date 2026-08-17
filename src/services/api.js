import axios from "axios";
import useAuthStore from "@/store/useAuthStore";

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

// Log the user out on a 401 so stale tokens don't loop forever — unless
// running under the dev bypass (no backend/DB yet), where every call 401s
// and would otherwise bounce the admin straight back to the login screen.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !localStorage.getItem("sca-dev-bypass")) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

export default api;
