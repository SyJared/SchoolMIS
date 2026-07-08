import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { getClassroomById } from "../api/classroomApi";
import AddStudentToClassroom from "./addStudentToClassroom";
import CreateClass from "./createClass";
import GradingChecklist from "./gradeChecklist";

function ClassroomDetails() {
    const { ClassroomId } = useParams();
    const [isGradingOpen, setIsGradingOpen] = useState(false);
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
            <button
                onClick={() => setIsGradingOpen(true)}
                className="rounded bg-blue-600 px-4 py-2 text-white"
            >
                Open Grading
            </button>

            <GradingChecklist
                open={isGradingOpen}
                onClose={() => setIsGradingOpen(false)}
            />
        </div>
    )
}

export default ClassroomDetails