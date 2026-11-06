import api from "./api";

export const loginRequest = (payload) => api.post("/auth/login", payload);
// `credential` is the signed ID token JWT from Google Identity Services
// (see components/common/GoogleSignInButton.jsx) — the backend verifies it.
export const googleLoginRequest = (credential) => api.post("/auth/google", { credential });
export const registerRequest = (payload) => api.post("/auth/register", payload);
export const meRequest = () => api.get("/auth/me");
export const updateProfileRequest = (payload) => api.patch("/auth/me", payload);
export const forgotPasswordRequest = (payload) => api.post("/auth/forgot-password", payload);
export const resetPasswordRequest = (token, payload) =>
  api.post(`/auth/reset-password/${token}`, payload);
