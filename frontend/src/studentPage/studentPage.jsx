import { useEffect, useState } from "react"
import { getMyClassrooms } from "../api/classroomStudentApi"
import { useAuth } from "../context/authContext"

function StudentPage() {
    const [classroom, setClassroom] = useState([]);
    const [classroomLoading, setClassroomLoading] = useState(true);
    const { user } = useAuth()
    useEffect(() => {
        const fetchMyClassroom = async () => {
            try {
                const res = await getMyClassrooms(user.role)
                setClassroom(res.data);
            } catch (err) {
                console.log(err)
            } finally {
                setClassroomLoading(false)
            }
        }
        fetchMyClassroom()
    }, [])
    const classroomRender = () => {
        return classroom.map((c) => {
            return (
                <div key={c.classroomId }>
                    <span>{c.classroom.advisor}</span>
                    <span>{c.classroom.subject}</span>
                    <span>{c.classroom.gradeLevel}</span>
                    <span>{c.classroom.section}</span>
                </div>
            )
        })
    }
    return (
        <div>
            {!classroomLoading && (classroomRender())}
            {console.log(classroom)}
        </div>
    )
}
export default StudentPage