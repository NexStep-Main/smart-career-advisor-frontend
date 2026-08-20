import api from "./api";

export const getAllProgress = () => api.get("/roadmap-progress");
export const getProgressByCareer = (careerId) => api.get(`/roadmap-progress/${careerId}`);
export const updateProgress = (careerId, completedPhases) =>
  api.put(`/roadmap-progress/${careerId}`, { completedPhases });
