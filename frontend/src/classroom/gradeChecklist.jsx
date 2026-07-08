import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGradesByClassroom, saveGrades } from "../api/gradeApi";

const PERIODS = ["prelims", "midterm", "prefinal", "final"];
const PERIOD_LABELS = {
    prelims: "Prelims",
    midterm: "Midterm",
    prefinal: "Prefinal",
    final: "Final",
};

function GradingChecklist({ open, onClose }) {
    const [visible, setVisible] = useState(false);
    const { ClassroomId } = useParams();

    const [students, setStudents] = useState([]); // [{ studentId, studentName, prelims, midterm, prefinal, final }]
    const [loading, setLoading] = useState(true);

    const [submitting, setSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");

    const [hasExisting, setHasExisting] = useState(false);

    useEffect(() => {
        if (!open) return;

        const fetchGrades = async () => {
            setLoading(true);
            try {
                const res = await getGradesByClassroom(ClassroomId);
                setStudents(res.data);
                setHasExisting(
                    res.data.some((s) =>
                        PERIODS.some((p) => s[p] !== null && s[p] !== undefined)
                    )
                );
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchGrades();
    }, [open, ClassroomId]);

    useEffect(() => {
        if (open) {
            setVisible(true);
        } else {
            const timeout = setTimeout(() => setVisible(false), 300);
            return () => clearTimeout(timeout);
        }
    }, [open]);

    const setScore = (studentId, period, value) => {
        let score = value === "" ? "" : Math.max(0, Math.min(100, Number(value)));
        setStudents((prev) =>
            prev.map((s) => (s.studentId === studentId ? { ...s, [period]: score } : s))
        );
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setSubmitMessage("");
        try {
            const gradesPayload = [];
            students.forEach((s) => {
                PERIODS.forEach((p) => {
                    if (s[p] !== "" && s[p] !== null && s[p] !== undefined) {
                        gradesPayload.push({
                            StudentId: s.studentId,
                            Period: PERIOD_LABELS[p], // backend enum expects "Prelims"/"Midterm"/etc
                            Score: Number(s[p]),
                        });
                    }
                });
            });

            await saveGrades({ ClassroomId: parseInt(ClassroomId), Grades: gradesPayload });
            setSubmitMessage("Grades saved!");
            setHasExisting(true);
        } catch (err) {
            console.log(err);
            setSubmitMessage(err.response?.data?.message || "Failed to save grades");
        } finally {
            setSubmitting(false);
        }
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div
                className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
                onClick={onClose}
            />

            <div
                className={`absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="text-lg font-semibold">Grading Checklist</h2>
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

                    {!loading && students.length > 0 && (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="py-2">Student</th>
                                    {PERIODS.map((p) => (
                                        <th key={p} className="py-2 px-2 text-center">
                                            {PERIOD_LABELS[p]}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((s) => (
                                    <tr key={s.studentId} className="border-b">
                                        <td className="py-2 font-medium">{s.studentName}</td>
                                        {PERIODS.map((p) => (
                                            <td key={p} className="px-2 text-center">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={s[p] ?? ""}
                                                    onChange={(e) => setScore(s.studentId, p, e.target.value)}
                                                    className="w-16 rounded border px-1 py-1 text-center"
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {!loading && students.length > 0 && (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="mt-4 w-full rounded bg-blue-600 py-2 text-white disabled:opacity-50"
                        >
                            {submitting ? "Saving..." : hasExisting ? "Edit Grades" : "Submit Grades"}
                        </button>
                    )}

                    {submitMessage && <p className="mt-2 text-sm">{submitMessage}</p>}
                </div>
            </div>
        </div>
    );
}

export default GradingChecklist;