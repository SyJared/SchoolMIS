import axios from "axios"
import { api } from "./registerApi"

export const getStudents = (search) => api.get("/students", {
    params: { search }
})
export const createStudents = async (name) => {
    const res = await fetch("http://localhost:5125/api/students", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(name)
    })
    return res.json()
}
export const deleteStudents = async ({Id}) => {
    const res = await fetch(`http://localhost:5125/api/students/${Id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    return res.json()
}
export const editStudents = async ({ Id, editName }) => {
    const res = await fetch(`http://localhost:5125/api/students/${Id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: editName })
    })
}

