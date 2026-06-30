import { useEffect, useState } from "react"
import { createClassroom, getClassroom } from "../api/classroomApi"
import {useNavigate } from "react-router-dom"
function Classroom() {
    const [classroomForm, setClassroomForm] = useState({
        Advisor: '',
        Subject: '',
        GradeLevel: '',
        Section: ''
    })
    const [createClassroomMessage, setCreateClassroomMessage] = useState("")
    const [classroom, setClassroom] = useState([])
    const [classroomLoading, setClassroomLoading] = useState(true)

    const navigate = useNavigate();
    useEffect(() => {
        const fetchClassroom = async () => {
            try {
                const res = await getClassroom();
               
                setClassroom(res.data.classrooms)
            } catch (err) {
                console.log(err)
            } finally {
                setClassroomLoading(false)
            }

            
        }
        fetchClassroom()
    },[])

    const handleChange = (e) => {
        setClassroomForm({ ...classroomForm, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await createClassroom(classroomForm)
            setCreateClassroomMessage(res.data.message)
        } catch (err) {
            console.log(err)
        }
    }
    const handleGoToClassroom = (ClassroomId) => {
        try {
            navigate(`/classroom/${ClassroomId}`)
        } catch (err) {
            console.log(err)
        }
    }
    const classRender = (classroom) => {
        return classroom.map((c) => {
            return (
                <div className="border-1" key={c.id} onClick={() => handleGoToClassroom(c.id)}>
                    <p>Advisor: {c.advisor}</p>
                    <p>Subject: {c.subject}</p>
                    <p>Grade Level: {c.gradeLevel}</p>
                    <p>Section: {c.section}</p>
                </div>
            )
        })
    }
    return (
        <div>
            Create Classroom
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Advisor:</label>
                    <input type="text" name="Advisor" value={classroomForm.Advisor} onChange={handleChange} />
                </div>
                <div>
                    <label>Subject:</label>
                    <input type="text" name="Subject" value={classroomForm.Subject} onChange={handleChange} />
                </div>
                <div>
                    <label>Grade Level:</label>
                    <input type="text" name="GradeLevel" value={classroomForm.GradeLevel} onChange={handleChange} />
                </div>
                <div>
                    <label>Section:</label>
                    <input type="text" name="Section" value={classroomForm.Section} onChange={handleChange} />
                </div>
                <button type="submit">Create classroom</button>
                {createClassroomMessage && (<p>{createClassroomMessage}</p>)}
            </form>
            <div>
                {classroomLoading ? "Loading" :  classRender(classroom) }
            </div>
        </div>
    )
}

export default Classroom