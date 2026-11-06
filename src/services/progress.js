import api from "./api";

// Streak + badges. Everything is awarded server-side; the client only displays.
export const getProgress = () => api.get("/progress");
export const dailyCheckIn = () => api.post("/progress/checkin");
