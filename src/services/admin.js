import adminApi from "./adminApi";

export const getAdminStats = () => adminApi.get("/admin/stats");

export const getAdminAdmins = () => adminApi.get("/admin/admins");
export const createAdminUser = (payload) => adminApi.post("/admin/admins", payload);
// Named ...Account (not ...AdminUser) to stay unambiguous next to the
// updateAdminUser/deleteAdminUser pair below, which edit a *student* record.
export const updateAdminAccount = (id, payload) => adminApi.patch(`/admin/admins/${id}`, payload);
export const deleteAdminAccount = (id) => adminApi.delete(`/admin/admins/${id}`);

export const getAdminUsers = (params) => adminApi.get("/admin/users", { params });
export const getAdminUser = (id) => adminApi.get(`/admin/users/${id}`);
export const updateAdminUser = (id, payload) => adminApi.patch(`/admin/users/${id}`, payload);
export const updateAdminUserStatus = (id, status) =>
  adminApi.patch(`/admin/users/${id}/status`, { status });
export const resetAdminUserQuiz = (id) => adminApi.post(`/admin/users/${id}/reset-quiz`);
export const bulkUpdateAdminUserStatus = (ids, status) =>
  adminApi.patch("/admin/users/bulk-status", { ids, status });
export const deleteAdminUser = (id) => adminApi.delete(`/admin/users/${id}`);
// responseType: "blob" — this is a CSV file download, not a JSON API response.
export const exportAdminUsers = (params) =>
  adminApi.get("/admin/users/export", { params, responseType: "blob" });

export const getAdminCareers = (params) => adminApi.get("/admin/careers", { params });
export const getCareerTagValues = (field) =>
  adminApi.get("/admin/careers/tag-values", { params: { field } });

export const getAdminRoadmaps = (params) => adminApi.get("/admin/roadmaps", { params });
export const deleteAdminRoadmap = (id) => adminApi.delete(`/admin/roadmaps/${id}`);
