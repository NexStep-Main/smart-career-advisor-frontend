import api from "./api";

export const getAdminStats = () => api.get("/admin/stats");

export const getAdminUsers = (params) => api.get("/admin/users", { params });
export const deleteAdminUser = (id) => api.delete(`/admin/users/${id}`);

export const getAdminCareers = (params) => api.get("/admin/careers", { params });

export const getAdminRoadmaps = (params) => api.get("/admin/roadmaps", { params });
export const deleteAdminRoadmap = (id) => api.delete(`/admin/roadmaps/${id}`);
