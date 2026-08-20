import api from "./api";

export const getPublicStats = () => api.get("/stats");
export const getLaborMarketStats = () => api.get("/stats/labor-market");
