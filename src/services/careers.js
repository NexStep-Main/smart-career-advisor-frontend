import api from "./api";

export const getCareers = (filters) => api.get("/careers", { params: filters });
export const getCareerById = (id) => api.get(`/careers/${id}`);

// Admin mutations — server requires an admin-role JWT for all three.
export const createCareer = (payload) => api.post("/careers", payload);
export const updateCareer = (id, payload) => api.put(`/careers/${id}`, payload);
export const deleteCareer = (id) => api.delete(`/careers/${id}`);
