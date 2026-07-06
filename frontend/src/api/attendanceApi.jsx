import { api } from "./registerApi";

export const createAttendance = (data) => api.post("/attendance", data);