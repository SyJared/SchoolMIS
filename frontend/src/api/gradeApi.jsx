import { api } from "./registerApi";

export const getGradesByClassroom = (classroomId) =>
    api.get(`/grades/classroom/${classroomId}`);

export const saveGrades = (payload) =>
    api.post(`/grades`, payload);