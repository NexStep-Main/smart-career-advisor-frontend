import api from "./api";

export const getRecommendations = () => api.get("/recommendations");
export const submitQuiz = (quizAnswers) => api.post("/recommendations/quiz", { quizAnswers });
// Public — a guest's quiz result; nothing is saved server-side.
export const previewQuiz = (quizAnswers) => api.post("/recommendations/preview", { quizAnswers });
// Groq-powered — returns richer, AI-generated career matches with personalized
// explanations. Requires the user to have completed the quiz.
export const getAiRecommendations = () => api.get("/recommendations/ai");
