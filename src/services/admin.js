import api from "./api";

export const getAdminStats = () => api.get("/admin/stats");

export const getAdminUsers = (params) => api.get("/admin/users", { params });
export const getAdminUser = (id) => api.get(`/admin/users/${id}`);
export const updateAdminUser = (id, payload) => api.patch(`/admin/users/${id}`, payload);
export const updateAdminUserStatus = (id, status) =>
  api.patch(`/admin/users/${id}/status`, { status });
export const resetAdminUserQuiz = (id) => api.post(`/admin/users/${id}/reset-quiz`);
export const bulkUpdateAdminUserStatus = (ids, status) =>
  api.patch("/admin/users/bulk-status", { ids, status });
export const deleteAdminUser = (id) => api.delete(`/admin/users/${id}`);
// responseType: "blob" — this is a CSV file download, not a JSON API response.
export const exportAdminUsers = (params) =>
  api.get("/admin/users/export", { params, responseType: "blob" });

export const getAdminCareers = (params) => api.get("/admin/careers", { params });

export const getAdminRoadmaps = (params) => api.get("/admin/roadmaps", { params });
export const deleteAdminRoadmap = (id) => api.delete(`/admin/roadmaps/${id}`);
