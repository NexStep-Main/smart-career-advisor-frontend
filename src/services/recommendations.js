import api from "./api";

export const getRecommendations = () => api.get("/recommendations");
export const submitQuiz = (quizAnswers) => api.post("/recommendations/quiz", { quizAnswers });
