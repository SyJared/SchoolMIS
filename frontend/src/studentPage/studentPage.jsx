import { useEffect, useState } from "react"
import { getMyClassrooms } from "../api/classroomStudentApi"
import { useAuth } from "../context/authContext"
import { useNavigate } from "react-router-dom"

function StudentPage() {
    const [classroom, setClassroom] = useState([]);
    const [classroomLoading, setClassroomLoading] = useState(true);

    const navigate = useNavigate()
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
                <div key={c.classroomId} onClick={() => navigate(`/studentClassroomDetails/${c.classroomId}`)}>
                    <span>{c.advisor}</span>
                    <span>{c.subject}</span>
                    <span>{c.gradeLevel}</span>
                    <span>{c.section}</span>
                </div>
            )
        })
    }
    return (
        <div>
            {!classroomLoading && (classroomRender())}
            
        </div>
    )
}
export default StudentPage