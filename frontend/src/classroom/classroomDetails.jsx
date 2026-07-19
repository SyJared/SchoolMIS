import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { getClassroomById } from "../api/classroomApi";
import AddStudentToClassroom from "./addStudentToClassroom";
import CreateClass from "./createClass";
import GradingChecklist from "./gradeChecklist";
import Assignment from "../assignment/assignment";
import { GraduationCap, User, BookOpen, Users, CalendarPlus, ClipboardCheck } from "lucide-react";

function ClassroomDetails() {
    const { ClassroomId } = useParams();
    const [isGradingOpen, setIsGradingOpen] = useState(false);
    const [classroom, setClassroom] = useState({});

    useEffect(() => {
        const fetchClassroomById = async () => {
            try {
                const res = await getClassroomById(ClassroomId)
                setClassroom(res.data);
            } catch (err) {
                console.log(err)
            }
        }
        fetchClassroomById()
    }, [ClassroomId])

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Classroom</h1>

            {/* Classroom info card */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <User size={16} className="text-indigo-600" />
                    <span className="text-gray-500">Advisor:</span>
                    <span className="font-medium">{classroom.advisor?.name ?? "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <GraduationCap size={16} className="text-indigo-600" />
                    <span className="text-gray-500">Grade Level:</span>
                    <span className="font-medium">{classroom.gradeLevel ?? "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Users size={16} className="text-indigo-600" />
                    <span className="text-gray-500">Section:</span>
                    <span className="font-medium">{classroom.section ?? "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <BookOpen size={16} className="text-indigo-600" />
                    <span className="text-gray-500">Subject:</span>
                    <span className="font-medium">{classroom.subject ?? "—"}</span>
                </div>
            </div>

            {/* Students */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <Users size={18} className="text-indigo-600" />
                    Students
                </h2>
                <AddStudentToClassroom ClassroomId={ClassroomId} />
            </div>

            {/* Create class */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <CalendarPlus size={18} className="text-indigo-600" />
                    Create Class
                </h2>
                <CreateClass ClassroomId={ClassroomId} />
            </div>

            {/* Grading */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-800 font-medium">
                    <ClipboardCheck size={18} className="text-indigo-600" />
                    Grading Checklist
                </div>
                <button
                    onClick={() => setIsGradingOpen(true)}
                    className="rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-sm font-medium text-white transition-colors"
                >
                    Open Grading
                </button>
            </div>

            <GradingChecklist
                open={isGradingOpen}
                onClose={() => setIsGradingOpen(false)}
            />

            {/* Assignments */}
            <Assignment classroomId={ClassroomId} />
        </div>
    )
}

export default ClassroomDetails