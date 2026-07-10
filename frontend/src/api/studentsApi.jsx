import axios from "axios"
import { api } from "./registerApi"

export const getStudents = (search) => api.get("/students", {
    params: { search }
})

export const createStudents = async (name) => api.post("/students", name)

export const deleteStudents = async ({ Id }) => api.delete(`/students/${Id}`)

export const editStudents = async ({ Id, editName }) => api.patch(`/students/${Id}`, { name: editName })

export const putStudentInfo = async (formData) => api.put("/students", formData)

export const getStudentInfoById = async (id) => api.get(`/students/${id}`);