import axios from "axios"
import { api } from "./registerApi";

export const addStudentInC = (data) => api.post(`/classroomstudent`, data)
export const getStudentOfClassroom = (classroomId)=> api.get(`/classroomstudent/${classroomId}`)