import api from "./api";
import adminApi from "./adminApi";

export const getCareers = (filters) => api.get("/careers", { params: filters });
export const getTrendingCareers = (limit) => api.get("/careers/trending", { params: { limit } });
export const getCareerById = (id) => api.get(`/careers/${id}`);

// Admin mutations — server requires an admin-role JWT for all three, so
// these go through adminApi (the admin token), not the student client.
export const createCareer = (payload) => adminApi.post("/careers", payload);
export const updateCareer = (id, payload) => adminApi.put(`/careers/${id}`, payload);
export const deleteCareer = (id) => adminApi.delete(`/careers/${id}`);
