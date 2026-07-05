import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { getClassroomById } from "../api/classroomApi";
import AddStudentToClassroom from "./addStudentToClassroom";
import CreateClass from "./createClass";
function ClassroomDetails() {
    const { ClassroomId } = useParams();
    const [classroom, setClassroom] = useState({});
    useEffect(() => {
        const fetchClassroomById = async() => {
            try {
                const res = await getClassroomById(ClassroomId)
                setClassroom(res.data);
                
            } catch (err) {
                console.log(err)
            }
        }
        fetchClassroomById()
    }, [])
    return (
        <div>
            classrooms
            <div className="border-1">
                Advisor: {classroom.advisor}
                Grade Level: {classroom.gradeLevel}
                Section: {classroom.section}
                Subject: {classroom.subject }
            </div>

            <div>
                <h1>Students</h1>
                <AddStudentToClassroom ClassroomId={ClassroomId} />
            </div>
            <div>
                <h1>Create class</h1>
                <CreateClass ClassroomId={ClassroomId} />
            </div>
        </div>
    )
}

export default ClassroomDetails