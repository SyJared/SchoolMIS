import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateQuiz from "./CreateQuiz";
import { useEffect } from "react";
import { getQuizzesByClassroom } from "../api/quizApi";
import { ClipboardList, BarChart3, Plus } from "lucide-react";

function Quizzes({ classroomId }) {
    const [quizzes, setQuizzes] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const navigate = useNavigate();

    const fetchQuizzes = async () => {
        const res = await getQuizzesByClassroom(classroomId);
        setQuizzes(res.data);
    };

    useEffect(() => {
        fetchQuizzes();
    }, [classroomId]);

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">Quizzes</h1>
                <button
                    onClick={() => setShowCreate((prev) => !prev)}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-3 py-2"
                >
                    <Plus size={15} />
                    {showCreate ? "Cancel" : "New Quiz"}
                </button>
            </div>

            {showCreate && (
                <CreateQuiz
                    classroomId={classroomId}
                    onCreated={() => {
                        setShowCreate(false); // hide the form
                        fetchQuizzes();       // refresh the list
                    }}
                />
            )}

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <ul className="divide-y divide-gray-100">
                    {quizzes.map((q) => (
                        <li
                            key={q.id}
                            onClick={() => navigate(`/quiz/${q.id}`)}
                            className="py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 px-2 rounded-lg transition-colors"
                        >
                            <div>
                                <p className="text-sm font-semibold text-gray-800">{q.title}</p>
                                <p className="text-xs text-gray-400">
                                    {q.questionCount} questions &middot; {q.timeLimitMinutes} min
                                </p>
                            </div>
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${q.published ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-500 border-gray-200"
                                }`}>
                                {q.published ? "Published" : "Draft"}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

}

export default Quizzes;