import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuizAttempts } from "../api/quizApi";
import { BarChart3, User, Clock } from "lucide-react";
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

function QuizAttempts() {
    const { quizId } = useParams();
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAttempts = async () => {
            try {
                const res = await getQuizAttempts(quizId);
                setAttempts(res.data);
            } catch (err) {
                console.log(err);
                setError("Failed to load quiz attempts");
            } finally {
                setLoading(false);
            }
        };
        fetchAttempts();
    }, [quizId]);

    if (loading) return <div className="p-6 text-sm text-gray-500">Loading attempts...</div>;
    if (error) return <div className="p-6 text-sm text-red-500">{error}</div>;

    const average = attempts.length
        ? attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length
        : 0;

    const chartData = attempts.map((a) => ({
        name: a.studentName,
        score: a.score,
    }));

    const formatDateTime = (iso) =>
        new Date(iso).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-1">
                    <BarChart3 size={20} className="text-indigo-600" />
                    Quiz Attempts
                </h1>
                <p className="text-sm text-gray-500">
                    {attempts.length} attempt{attempts.length !== 1 && "s"} &middot; average score{" "}
                    <span className="font-semibold text-gray-800">{average.toFixed(1)}</span>
                </p>
            </div>

            {/* Chart */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-sm font-semibold text-gray-700 mb-4">Scores by Student</h2>

                {attempts.length === 0 ? (
                    <p className="text-sm text-gray-400">No attempts yet.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
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

            {/* Attempts table */}
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

export default QuizAttempts;