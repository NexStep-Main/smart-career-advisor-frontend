import api from "./api";

export const getRecommendations = () => api.get("/recommendations");
export const submitQuiz = (quizAnswers) => api.post("/recommendations/quiz", { quizAnswers });
// Public — a guest's quiz result; nothing is saved server-side.
export const previewQuiz = (quizAnswers) => api.post("/recommendations/preview", { quizAnswers });
