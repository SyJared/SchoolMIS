import { api } from "./registerApi";

export const createAttendance = (data) => api.post("/attendance", data);
export const getAttendanceById = (classId) => api.get(`/attendance/${classId}`)