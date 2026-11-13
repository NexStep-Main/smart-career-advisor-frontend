import api from "./api";

// Public wishlist of careers students want added. `voterId` is an anonymous
// per-browser id (see lib/voterId.js) so guests can vote once without an account.
export const getCareerRequests = (voterId) => api.get("/career-requests", { params: { voterId } });
export const createCareerRequest = (payload) => api.post("/career-requests", payload);
export const voteCareerRequest = (id, voterId) => api.post(`/career-requests/${id}/vote`, { voterId });
export const unvoteCareerRequest = (id, voterId) =>
  api.delete(`/career-requests/${id}/vote`, { data: { voterId } });
