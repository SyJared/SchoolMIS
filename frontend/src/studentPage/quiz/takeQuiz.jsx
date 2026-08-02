import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizById, submitQuizAttempt, hasAttempted } from "../../api/quizApi";
import { Clock, Eye } from "lucide-react";

function TakeQuiz() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [startedAt] = useState(new Date().toISOString());
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [blocked, setBlocked] = useState(false);
    const [existingAttemptId, setExistingAttemptId] = useState(null);

    useEffect(() => {
        const init = async () => {
            try {
                const already = await hasAttempted(quizId);
                if (already.data.attempted) {
                    setBlocked(true);
                    setExistingAttemptId(already.data.attemptId);
                    setLoading(false);
                    return;
                }
                const res = await getQuizById(quizId);
                setQuiz(res.data);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [quizId]);

    const setChoiceAnswer = (questionId, choiceId) => {
        setAnswers((prev) => ({ ...prev, [questionId]: { choiceId, answerText: null } }));
    };

    const setTextAnswer = (questionId, text) => {
        setAnswers((prev) => ({ ...prev, [questionId]: { choiceId: null, answerText: text } }));
    };

    const submit = async () => {
        setSubmitting(true);
        const payload = {
            QuizId: Number(quizId),
            StartedAt: startedAt,
            Answers: quiz.questions.map((q) => ({
                QuestionId: q.id,
                ChoiceId: answers[q.id]?.choiceId ?? null,
                AnswerText: answers[q.id]?.answerText ?? null,
            })),
        };

        try {
            const res = await submitQuizAttempt(payload);
            navigate(`/quiz/attempt/${res.data.attemptId}/result`);
        } catch (err) {
            console.log(err);
            alert(err.response?.data?.message ?? "Failed to submit quiz");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-6 text-sm text-gray-500">Loading quiz...</div>;

    if (blocked) {
        return (
            <div className="max-w-md mx-auto p-6 text-center space-y-4">
                <p className="text-sm text-gray-600">You've already attempted this quiz.</p>
                <button
                    onClick={() => navigate(`/quiz/attempt/${existingAttemptId}/result`)}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg px-4 py-2.5 transition-colors"
                >
                    <Eye size={15} />
                    View your results
                </button>
            </div>
        );
    }

    if (!quiz) return <div className="p-6 text-sm text-gray-500">Quiz not found.</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
                <p className="text-sm text-gray-500 mt-1">{quiz.description}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-2">
                    <Clock size={12} /> {quiz.timeLimitMinutes} minutes
                </p>
            </div>

            {quiz.questions.map((q, i) => (
                <div key={q.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                    <p className="text-sm font-semibold text-gray-800 mb-3">
                        {i + 1}. {q.questionText} <span className="text-xs text-gray-400">({q.points} pts)</span>
                    </p>

                    {(q.type === "MultipleChoice" || q.type === "TrueFalse") ? (
                        <div className="space-y-2">
                            {q.choices.map((c) => (
                                <label key={c.id} className="flex items-center gap-2 text-sm text-gray-700">
                                    <input
                                        type="radio"
                                        name={`q-${q.id}`}
                                        checked={answers[q.id]?.choiceId === c.id}
                                        onChange={() => setChoiceAnswer(q.id, c.id)}
                                    />
                                    {c.text}
                                </label>
                            ))}
                        </div>
                    ) : (
                        <textarea
                            rows={q.type === "Essay" ? 5 : 2}
                            value={answers[q.id]?.answerText ?? ""}
                            onChange={(e) => setTextAnswer(q.id, e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            placeholder="Your answer..."
                        />
                    )}
                </div>
            ))}

            <button
                onClick={submit}
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium text-sm rounded-lg px-4 py-3 transition-colors"
            >
                {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
        </div>
    );
}

export default TakeQuiz;