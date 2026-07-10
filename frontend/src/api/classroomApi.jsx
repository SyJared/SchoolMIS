import axios from "axios"
import { api } from "./registerApi"

export const createClassroom = (data) => api.post("/classroom", data);
export const getClassroom = () => api.get("/classroom");

export const getClassroomById = (ClassroomId) => api.get(`/classroom/${ClassroomId}`)
export const deleteClassroom = (ClassroomId) => api.delete(`/classroom/${ClassroomId}`)
export const getTeacherClassroom = () => api.get('/classroom/teacher')