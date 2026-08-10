import api from "./api";

export const getCareers = (filters) => api.get("/careers", { params: filters });
export const getCareerById = (id) => api.get(`/careers/${id}`);
export const getRecommendations = () => api.get("/recommendations");
export const saveCareer = (id) => api.post(`/careers/${id}/save`);
