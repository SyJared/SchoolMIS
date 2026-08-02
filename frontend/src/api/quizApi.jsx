import { api } from "./registerApi";

export const createQuiz = (data) => api.post("/quiz", data);
export const getQuizzesByClassroom = (classroomId) => api.get(`/quiz/classroom/${classroomId}`);
export const getQuizAttempts = (quizId) => api.get(`/quiz/${quizId}/attempts`);
export const togglePublish = (quizId, published) =>
    api.patch(`/quiz/${quizId}/publish`, published, {
        headers: { "Content-Type": "application/json" },
    });
export const getQuizById = (quizId) => api.get(`/quiz/${quizId}`);
export const getPublishedQuizzesByClassroom = (classroomId) => api.get(`/quiz/classroom/${classroomId}/published`);
export const hasAttempted = (quizId) => api.get(`/quiz/${quizId}/attempted`);
export const submitQuizAttempt = (data) => api.post(`/quiz/attempt`, data);
export const getAttemptResult = (attemptId) => api.get(`/quiz/attempt/${attemptId}/result`);