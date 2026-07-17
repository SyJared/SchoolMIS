import { api } from "./registerApi";

export const createClass = (data) => api.post(`/classes`, data);

export const getAllClass = () => api.get("/classes");

export const markAsDone = (classId) => api.post(`/classes/${classId}`)
export const getTeacherClassroom = () => api.get('/classes/teacher')

export const getAllClassByStudentId =()=> api.get('/classes/student')