import axios from "axios";
import useAdminAuthStore from "@/store/useAdminAuthStore";

/**
 * Separate axios instance for every admin-portal request — mirrors api.js
 * exactly, but reads/writes useAdminAuthStore instead of useAuthStore.
 * Student pages must never accidentally carry an admin bearer token (or
 * vice versa); giving each portal its own client makes that a type-level
 * separation instead of a "remember to use the right store" convention.
 */
const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

adminApi.interceptors.request.use((config) => {
  const token = useAdminAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAdminAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

export default adminApi;
