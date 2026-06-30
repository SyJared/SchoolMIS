import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:5125/api"
});

export const login = (data) => api.post("/login", data);

export const register = (data) => api.post("/register", data);