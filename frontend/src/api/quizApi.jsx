import { api } from "./registerApi";

export const createQuiz = (data) => api.post("/quiz", data);
export const getQuizzesByClassroom = (classroomId) => api.get(`/quiz/classroom/${classroomId}`);
export const getQuizAttempts = (quizId) => api.get(`/quiz/${quizId}/attempts`);
export const togglePublish = (quizId, published) => api.patch(`/quiz/${quizId}/publish`, published);
export const getQuizById = (quizId) => api.get(`/quiz/${quizId}`);