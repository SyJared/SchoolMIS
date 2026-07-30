import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuizById, getQuizAttempts } from "../api/quizApi";
import { ClipboardList, BarChart3, User, Clock, CalendarClock } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";

function QuizDetails() {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [quizRes, attemptsRes] = await Promise.all([
                    getQuizById(quizId),
                    getQuizAttempts(quizId),
                ]);
                setQuiz(quizRes.data);
                setAttempts(attemptsRes.data);
            } catch (err) {
                console.log(err);
                setError("Failed to load quiz");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [quizId]);

    if (loading) return <div className="p-6 text-sm text-gray-500">Loading quiz...</div>;
    if (error) return <div className="p-6 text-sm text-red-500">{error}</div>;
    if (!quiz) return <div className="p-6 text-sm text-gray-500">Quiz not found.</div>;

    const average = attempts.length
        ? attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length
        : 0;

    const chartData = attempts.map((a) => ({ name: a.studentName, score: a.score }));

    const formatDateTime = (iso) =>
        new Date(iso).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Quiz overview */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <ClipboardList size={20} className="text-indigo-600" />
                            {quiz.title}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">{quiz.description}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border whitespace-nowrap ${quiz.published ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-500 border-gray-200"
                        }`}>
                        {quiz.published ? "Published" : "Draft"}
                    </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                        <CalendarClock size={14} className="text-gray-400" />
                        {formatDateTime(quiz.startDate)} → {formatDateTime(quiz.endDate)}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock size={14} className="text-gray-400" />
                        {quiz.timeLimitMinutes} min
                    </span>
                    <span>{quiz.questions.length} questions</span>
                </div>
            </div>

            {/* Questions */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-sm font-semibold text-gray-700 mb-4">Questions</h2>
                <ul className="divide-y divide-gray-100">
                    {quiz.questions.map((q, i) => (
                        <li key={q.id} className="py-3">
                            <p className="text-sm font-medium text-gray-800">
                                {i + 1}. {q.questionText}
                                <span className="ml-2 text-xs text-gray-400">({q.points} pts, {q.type})</span>
                            </p>
                            {q.choices.length > 0 && (
                                <ul className="mt-1.5 pl-4 space-y-1">
                                    {q.choices.map((c) => (
                                        <li
                                            key={c.id}
                                            className={`text-xs ${c.isCorrect ? "text-green-600 font-medium" : "text-gray-500"}`}
                                        >
                                            {c.isCorrect ? "✓ " : "• "}{c.text}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Attempts chart */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
                    <BarChart3 size={16} className="text-indigo-600" />
                    Scores by Student
                </h2>
                <p className="text-xs text-gray-400 mb-4">
                    {attempts.length} attempt{attempts.length !== 1 && "s"} &middot; average {average.toFixed(1)}
                </p>

                {attempts.length === 0 ? (
                    <p className="text-sm text-gray-400">No attempts yet.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={60} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <ReferenceLine y={average} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: "Avg", position: "right", fill: "#f59e0b", fontSize: 12 }} />
                            <Bar dataKey="score" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Attempts list */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-sm font-semibold text-gray-700 mb-4">Attempt Details</h2>
                {attempts.length === 0 ? (
                    <p className="text-sm text-gray-400">No attempts yet.</p>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {attempts.map((a) => (
                            <li key={a.id} className="py-3 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-gray-800">
                                    <User size={14} className="text-gray-400" />
                                    {a.studentName}
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1 text-xs text-gray-400">
                                        <Clock size={12} />
                                        {formatDateTime(a.submittedAt)}
                                    </span>
                                    <span className="text-sm font-semibold text-indigo-600">
                                        {a.score.toFixed(1)}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default QuizDetails;