import api from "./api";

export const getRoadmapByCareer = (careerId) => api.get(`/roadmaps/${careerId}`);
export const createRoadmap = (payload) => api.post("/roadmaps", payload);
export const updateRoadmap = (id, payload) => api.put(`/roadmaps/${id}`, payload);
