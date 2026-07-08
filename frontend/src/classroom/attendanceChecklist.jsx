import { useEffect, useState } from "react";
import { getStudentOfClassroom } from "../api/classroomStudentApi";
import { useParams } from "react-router-dom";
import { createAttendance, getAttendanceById } from "../api/attendanceApi";
import { markAsDone } from "../api/classApi";

const STATUSES = ["Present", "Absent", "Late", "Excused"];

function AttendanceChecklist({ open, onClose, classes }) {
    const [visible, setVisible] = useState(false);
    const { ClassroomId } = useParams();

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [attendance, setAttendance] = useState({}); // { studentId: "Present" | "Absent" | "Late" | "Excused" }

    const [submitting, setSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");

    const [existingAttendance, setExistingAttendance] = useState([]);

    useEffect(() => {
        if (!open) return;

        const fetchData = async () => {
            setLoading(true);

            try {
                const [studentsRes, attendanceRes] = await Promise.all([
                    getStudentOfClassroom(ClassroomId),
                    getAttendanceById(open).catch(() => ({ data: [] }))
                ]);

                const studentsData = studentsRes.data;
                const existing = attendanceRes.data || [];
                
                setStudents(studentsData);
                setExistingAttendance(existing);

                // studentId -> status
                const existingMap = {};

                existing.forEach((item) => {
                    existingMap[item.studentId] = item.status;
                });

                const initial = {};

                studentsData.forEach((s) => {
                    initial[s.studentId] =
                        existingMap[s.studentId] || "Present";
                });

                setAttendance(initial);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [open, ClassroomId]);

    useEffect(() => {
        if (open) {
            setVisible(true);
        } else {
            const timeout = setTimeout(() => setVisible(false), 300);
            return () => clearTimeout(timeout);
        }
    }, [open]);

    const setStatus = (studentId, status) => {
        setAttendance((prev) => ({ ...prev, [studentId]: status }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setSubmitMessage("");
        try {
            const payload = {
                ClassId: open, // `open` holds the class id passed down from CreateClass
                Attendance: Object.entries(attendance).map(([studentId, status]) => ({
                    StudentId: parseInt(studentId),
                    Status: status, // "Present" | "Absent" | "Late" | "Excused"
                })),
            };
            await createAttendance(payload);
            setSubmitMessage(
                existingAttendance.length > 0 ? "Attendance updated!" : "Attendance saved!"
            );
            setExistingAttendance(payload.Attendance); // reflect the new saved state locally
        } catch (err) {
            
            setSubmitMessage(err.response?.data?.message || "Failed to save attendance");
        } finally {
            setSubmitting(false);
        }
    };
    const handleMarkAsDone = async () => {
        try {
            const res = await markAsDone(open);
        } catch (err) {
            console.log(err)
        }
    }

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"
                    }`}
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="text-lg font-semibold">Attendance Checklist</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
                    {loading && <p className="text-sm text-gray-500">Loading students...</p>}

                    {!loading && students.length === 0 && (
                        <p className="text-sm text-gray-500">No students in this classroom yet.</p>
                    )}

                    {!loading &&
                        students.map((s) => (
                            <div
                                key={s.studentId}
                                className="border-b py-3"
                            >
                                <p className="font-medium mb-2">
                                    {s.student.name}
                                </p>

                                <div className="flex gap-4 flex-wrap">
                                    {STATUSES.map((status) => (
                                        <label
                                            key={status}
                                            className="flex items-center gap-1 text-sm cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name={`attendance-${s.studentId}`}
                                                value={status}
                                                checked={attendance[s.studentId] === status}
                                                onChange={() => setStatus(s.studentId, status)}
                                            />
                                            {status}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    {!loading && students.length > 0 && (
                        <>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="mt-4 w-full rounded bg-blue-600 py-2 text-white disabled:opacity-50"
                        >
                            {submitting
                                ? "Saving..."
                                : existingAttendance.length > 0
                                    ? "Edit Attendance"
                                    : "Submit Attendance"}
                            </button>
                            <button onClick={() => handleMarkAsDone()} className="bg-green-500 px-10"> Mark as done</button>
                        </>
                    )}
                    {submitMessage && <p className="mt-2 text-sm">{submitMessage}</p>}
                </div>
            </div>
        </div>
    );
}

export default AttendanceChecklist;