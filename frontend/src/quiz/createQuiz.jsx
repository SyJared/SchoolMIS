import { useState } from "react";
import { createQuiz } from "../api/quizApi";
import { Plus, Trash2, ClipboardList } from "lucide-react";


const QUESTION_TYPES = ["MultipleChoice", "TrueFalse", "ShortAnswer", "Essay"];
const toUtcIso = (localDateTimeStr) => new Date(localDateTimeStr).toISOString();
function emptyChoice() {
    return { text: "", isCorrect: false };
}

function emptyQuestion(type = "MultipleChoice") {
    return {
        questionText: "",
        type,
        points: 1,
        choices: type === "TrueFalse"
            ? [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }]
            : type === "MultipleChoice"
                ? [emptyChoice(), emptyChoice()]
                : [],
    };
}

function CreateQuiz({ classroomId, onCreated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [timeLimitMinutes, setTimeLimitMinutes] = useState(30);
    const [shuffleQuestions, setShuffleQuestions] = useState(false);
    const [shuffleChoices, setShuffleChoices] = useState(false);
    const [published, setPublished] = useState(false);
    const [questions, setQuestions] = useState([emptyQuestion()]);
    const [submitting, setSubmitting] = useState(false);

    const updateQuestion = (index, changes) => {
        setQuestions((prev) =>
            prev.map((q, i) => (i === index ? { ...q, ...changes } : q))
        );
    };

    const changeQuestionType = (index, type) => {
        updateQuestion(index, { ...emptyQuestion(type), questionText: questions[index].questionText, points: questions[index].points });
    };

    const updateChoice = (qIndex, cIndex, changes) => {
        setQuestions((prev) =>
            prev.map((q, i) => {
                if (i !== qIndex) return q;
                const choices = q.choices.map((c, ci) => (ci === cIndex ? { ...c, ...changes } : c));
                return { ...q, choices };
            })
        );
    };

    const setCorrectChoice = (qIndex, cIndex) => {
        setQuestions((prev) =>
            prev.map((q, i) => {
                if (i !== qIndex) return q;
                const choices = q.choices.map((c, ci) => ({ ...c, isCorrect: ci === cIndex }));
                return { ...q, choices };
            })
        );
    };

    const addQuestion = () => setQuestions((prev) => [...prev, emptyQuestion()]);
    const removeQuestion = (index) => setQuestions((prev) => prev.filter((_, i) => i !== index));

    const addChoice = (qIndex) => {
        setQuestions((prev) =>
            prev.map((q, i) => (i === qIndex ? { ...q, choices: [...q.choices, emptyChoice()] } : q))
        );
    };

    const removeChoice = (qIndex, cIndex) => {
        setQuestions((prev) =>
            prev.map((q, i) =>
                i === qIndex ? { ...q, choices: q.choices.filter((_, ci) => ci !== cIndex) } : q
            )
        );
    };

    const submit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            Title: title,
            Description: description,
            StartDate: toUtcIso(startDate),   // was: startDate
            EndDate: toUtcIso(endDate),
            TimeLimitMinutes: Number(timeLimitMinutes),
            ShuffleQuestions: shuffleQuestions,
            ShuffleChoices: shuffleChoices,
            Published: published,
            ClassroomId: Number(classroomId),
            Questions: questions.map((q) => ({
                QuestionText: q.questionText,
                Type: q.type,
                Points: Number(q.points),
                Choices: (q.type === "MultipleChoice" || q.type === "TrueFalse")
                    ? q.choices.map((c) => ({ Text: c.text, IsCorrect: c.isCorrect }))
                    : null,
            })),
        };

        try {
            await createQuiz(payload);
            alert("Quiz created!");
            setTitle("");
            setDescription("");
            setStartDate("");
            setEndDate("");
            setTimeLimitMinutes(30);
            setShuffleQuestions(false);
            setShuffleChoices(false);
            setPublished(false);
            setQuestions([emptyQuestion()]);
            onCreated?.();
        } catch (err) {
            console.log(err);
            alert("Failed to create quiz");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h1 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ClipboardList size={20} className="text-indigo-600" />
                    Create Quiz
                </h1>

                <form onSubmit={submit} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                                type="datetime-local"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
                        <input
                            type="number"
                            min={1}
                            value={timeLimitMinutes}
                            onChange={(e) => setTimeLimitMinutes(e.target.value)}
                            required
                            className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex flex-wrap gap-5">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input type="checkbox" checked={shuffleQuestions} onChange={(e) => setShuffleQuestions(e.target.checked)} />
                            Shuffle questions
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input type="checkbox" checked={shuffleChoices} onChange={(e) => setShuffleChoices(e.target.checked)} />
                            Shuffle choices
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
                            Publish immediately
                        </label>
                    </div>

                    {/* Questions builder */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-semibold text-gray-800">Questions</h2>

                        {questions.map((q, qIndex) => (
                            <div key={qIndex} className="border border-gray-200 rounded-xl p-4 space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="flex-1">
                                        <input
                                            placeholder={`Question ${qIndex + 1}`}
                                            value={q.questionText}
                                            onChange={(e) => updateQuestion(qIndex, { questionText: e.target.value })}
                                            required
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <select
                                        value={q.type}
                                        onChange={(e) => changeQuestionType(qIndex, e.target.value)}
                                        className="border border-gray-300 rounded-lg px-2 py-2 text-sm"
                                    >
                                        {QUESTION_TYPES.map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        min={1}
                                        value={q.points}
                                        onChange={(e) => updateQuestion(qIndex, { points: e.target.value })}
                                        className="w-20 border border-gray-300 rounded-lg px-2 py-2 text-sm"
                                        title="Points"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeQuestion(qIndex)}
                                        className="text-red-400 hover:text-red-600 p-2"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                {(q.type === "MultipleChoice" || q.type === "TrueFalse") && (
                                    <div className="pl-2 space-y-2">
                                        {q.choices.map((c, cIndex) => (
                                            <div key={cIndex} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name={`correct-${qIndex}`}
                                                    checked={c.isCorrect}
                                                    onChange={() => setCorrectChoice(qIndex, cIndex)}
                                                />
                                                <input
                                                    value={c.text}
                                                    onChange={(e) => updateChoice(qIndex, cIndex, { text: e.target.value })}
                                                    disabled={q.type === "TrueFalse"}
                                                    placeholder={`Choice ${cIndex + 1}`}
                                                    required
                                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                                                />
                                                {q.type === "MultipleChoice" && q.choices.length > 2 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeChoice(qIndex, cIndex)}
                                                        className="text-gray-300 hover:text-red-500"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        {q.type === "MultipleChoice" && (
                                            <button
                                                type="button"
                                                onClick={() => addChoice(qIndex)}
                                                className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800"
                                            >
                                                <Plus size={12} />
                                                Add choice
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addQuestion}
                            className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                        >
                            <Plus size={15} />
                            Add question
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium text-sm rounded-lg px-4 py-2 transition-colors"
                    >
                        {submitting ? "Creating..." : "Create Quiz"}
                    </button>
                </form>
            </div>
        </div>
    );
    
}

export default CreateQuiz;