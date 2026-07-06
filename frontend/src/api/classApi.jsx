import { api } from "./registerApi";

export const createClass = (data) => api.post(`/classes`, data);

export const getAllClass = () => api.get("/classes");