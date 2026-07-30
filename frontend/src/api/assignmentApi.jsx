import { api } from "./registerApi";

export const createAssignment = (data) => api.post(`/assignment`, data, {
    headers: {
        "Content-Type": "multipart/form-data"
    }
})

export const getAssignment = (classroomId) => api.get(`/assignment/${classroomId}`)

export const updateAssignment = (data) => api.patch('/assignment', data)

export const deleteAssignment = (assignmentId) => api.delete(`/assignment/${assignmentId}`)