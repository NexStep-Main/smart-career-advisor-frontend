import api from "./api";

// Unauthenticated admin-portal auth surface — separate from services/auth.js
// (student) and services/admin.js (authenticated admin actions).
export const getBootstrapStatus = () => api.get("/admin/auth/bootstrap-status");
export const bootstrapSuperadmin = (payload) => api.post("/admin/auth/bootstrap", payload);
export const adminLoginRequest = (payload) => api.post("/admin/auth/login", payload);
