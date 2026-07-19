import { useEffect, useState } from "react";
import { createClass, getAllClass } from "../api/classApi";
import AttendanceChecklist from "./attendanceChecklist";
import { Clock, CheckCircle2, AlarmClock } from "lucide-react";

function CreateClass({ ClassroomId }) {
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const [open, setOpen] = useState(null);

    const fetchClass = async () => {
        try {
            const res = await getAllClass();
            setClasses(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchClass();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createClass({ ClassroomId, Start: start, End: end })
            setStart("");
            setEnd("");
            fetchClass();
        } catch (err) {
            console.log(err)
        } finally {
            setSubmitting(false);
        }
    }

    const formatDateTime = (iso) =>
        new Date(iso).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        })

    const classRender = (classes) => {
        return classes.map((c) => (
            <div
                key={c.id}
                onClick={() => setOpen(c.id)}
                className="cursor-pointer border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <Clock size={16} className="text-gray-400" />
                    <div className="text-sm text-gray-700">
                        <p className="font-medium">{formatDateTime(c.start)}</p>
                        <p className="text-xs text-gray-400">to {formatDateTime(c.end)}</p>
                    </div>
                </div>
                <span
                    className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${c.isDone
                            ? "bg-gray-50 text-gray-500 border-gray-200"
                            : "bg-blue-50 text-blue-600 border-blue-200"
                        }`}
                >
                    {c.isDone ? <CheckCircle2 size={13} /> : <AlarmClock size={13} />}
                    {c.isDone ? "Class ended" : "Please be ready"}
                </span>
            </div>
        ))
    }

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:items-end gap-3">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
                    <input
                        type="datetime-local"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">End</label>
                    <input
                        type="datetime-local"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
                >
                    {submitting ? "Creating..." : "Submit"}
                </button>
            </form>

            <div className="space-y-2">
                {loading ? (
                    <p className="text-sm text-gray-400">Loading classes...</p>
                ) : classes.length === 0 ? (
                    <p className="text-sm text-gray-400">No classes yet.</p>
                ) : (
                    classRender(classes)
                )}
            </div>

            <AttendanceChecklist open={open} onClose={() => setOpen(null)} classes={classes} />
        </div>
    )
}
export default CreateClass