import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPublishedQuizzesByClassroom } from "../../api/quizApi";
import { ClipboardList, Clock, CalendarClock } from "lucide-react";

function StudentQuizzes({ classroomId }) {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await getPublishedQuizzesByClassroom(classroomId);
                setQuizzes(res.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, [classroomId]);

    const now = new Date();

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-4">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ClipboardList size={20} className="text-indigo-600" />
                Quizzes
            </h1>

            {loading && <p className="text-sm text-gray-500">Loading quizzes...</p>}
            {!loading && quizzes.length === 0 && (
                <p className="text-sm text-gray-500">No quizzes available.</p>
            )}

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-100">
                {quizzes.map((q) => {
                    const isOpen = now >= new Date(q.startDate) && now <= new Date(q.endDate);
                    return (
                        <div
                            key={q.id}
                            onClick={() => isOpen && navigate(`/quiz/${q.id}/take`)}
                            className={`p-4 flex items-center justify-between ${
                                isOpen ? "cursor-pointer hover:bg-gray-50" : "opacity-50 cursor-not-allowed"
                            }`}
                        >
                            <div>
                                <p className="text-sm font-semibold text-gray-800">{q.title}</p>
                                <p className="text-xs text-gray-400 flex items-center gap-3 mt-1">
                                    <span className="flex items-center gap-1">
                                        <Clock size={12} /> {q.timeLimitMinutes} min
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <CalendarClock size={12} />
                                        {new Date(q.endDate).toLocaleDateString()}
                                    </span>
                                </p>
                            </div>
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                                isOpen
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-gray-50 text-gray-400 border-gray-200"
                            }`}>
                                {isOpen ? "Open" : "Closed"}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default StudentQuizzes;