import axios from "axios";
import { api } from "./registerApi";

export const searchTeacher = async (search) => api.get("/teacher", {params : {search}})