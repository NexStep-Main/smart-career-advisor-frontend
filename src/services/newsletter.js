import api from "./api";

export const subscribeToNewsletter = (email) => api.post("/newsletter/subscribe", { email });
