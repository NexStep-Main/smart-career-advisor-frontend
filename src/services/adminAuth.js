import adminApi from "./adminApi";

// Unauthenticated admin-portal auth surface — separate from services/auth.js
// (student) and services/admin.js (authenticated admin actions). Routed
// through adminApi (not api) so a successful login's token only ever needs
// to flow into useAdminAuthStore, never the student store.
export const getBootstrapStatus = () => adminApi.get("/admin/auth/bootstrap-status");
export const bootstrapSuperadmin = (payload) => adminApi.post("/admin/auth/bootstrap", payload);
export const adminLoginRequest = (payload) => adminApi.post("/admin/auth/login", payload);
// `credential` is the signed ID token JWT from Google Identity Services
// (see components/common/GoogleSignInButton.jsx) — the backend verifies it.
export const googleAdminLoginRequest = (credential) =>
  adminApi.post("/admin/auth/google", { credential });

// GET /api/auth/me is role-agnostic (just returns req.user for whichever
// token is attached) — reused here via adminApi so App.jsx's boot-time
// session check can validate a persisted admin token independently of the
// student one.
export const adminMeRequest = () => adminApi.get("/auth/me");
