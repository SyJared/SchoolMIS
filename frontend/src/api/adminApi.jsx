import { api } from "./registerApi";

export const getAdminDashboard = () => api.get("/admindashboard");