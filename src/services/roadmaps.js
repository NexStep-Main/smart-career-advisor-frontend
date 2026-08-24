import api from "./api";
import adminApi from "./adminApi";

export const getRoadmapByCareer = (careerId) => api.get(`/roadmaps/${careerId}`);

// Admin mutations — require an admin-role JWT, so these go through adminApi.
export const createRoadmap = (payload) => adminApi.post("/roadmaps", payload);
export const updateRoadmap = (id, payload) => adminApi.put(`/roadmaps/${id}`, payload);
