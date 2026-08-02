import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAttemptResult } from "../../api/quizApi";
import { CheckCircle2, XCircle, HelpCircle, Trophy } from "lucide-react";

function QuizResult() {
    const { attemptId } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const res = await getAttemptResult(attemptId);
                setResult(res.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [attemptId]);

    if (loading) return <div className="p-6 text-sm text-gray-500">Loading results...</div>;
    if (!result) return <div className="p-6 text-sm text-gray-500">Result not found.</div>;

    const percent = result.maxScore > 0 ? (result.score / result.maxScore) * 100 : 0;

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            {/* Score summary */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 text-center">
                <Trophy size={32} className="text-amber-500 mx-auto mb-2" />
                <h1 className="text-lg font-bold text-gray-900">{result.quizTitle}</h1>
                <p className="text-3xl font-extrabold text-indigo-600 mt-2">
                    {result.score} / {result.maxScore}
                </p>
                <p className="text-sm text-gray-500 mt-1">{percent.toFixed(0)}% correct</p>
            </div>

            {/* Per-question breakdown */}
            <div className="space-y-4">
                {result.answers.map((a, i) => {
                    const isGraded = a.type === "MultipleChoice" || a.type === "TrueFalse";
                    return (
                        <div key={a.questionId} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                            <div className="flex items-start gap-2">
                                {isGraded ? (
                                    a.isCorrect ? (
                                        <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                                    ) : (
                                        <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                                    )
                                ) : (
                                    <HelpCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                                )}
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-800">
                                        {i + 1}. {a.questionText}
                                        <span className="ml-2 text-xs text-gray-400">
                                            ({a.earnedPoints}/{a.points} pts)
                                        </span>
                                    </p>

                                    {isGraded ? (
                                        <div className="mt-2 space-y-1 text-sm">
                                            <p className={a.isCorrect ? "text-green-600" : "text-red-500"}>
                                                Your answer: {a.selectedChoiceText ?? "No answer"}
                                            </p>
                                            {!a.isCorrect && (
                                                <p className="text-gray-500">
                                                    Correct answer: <span className="font-medium">{a.correctChoiceText}</span>
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="mt-2 text-sm text-gray-600">
                                            <p className="italic">Your answer: {a.answerText || "No answer"}</p>
                                            <p className="text-xs text-amber-600 mt-1">Pending manual grading</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <button
                onClick={() => navigate(-1)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm rounded-lg px-4 py-2.5 transition-colors"
            >
                Back to Quizzes
            </button>
        </div>
    );
}

export default QuizResult;