import { useEffect, useState } from "react";
import { getAssignment } from "../api/assignmentApi";
import {
    FileText,
    CalendarClock,
    Paperclip,
    CheckCircle2,
    AlertTriangle,
    Clock,
} from "lucide-react";

// adjust base URL to match your backend static file server
const fileUrl = (path) => `http://localhost:5125/${path}`;

const formatDate = (d) =>
    new Date(d).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

// Returns a status badge config based on how close/far the due date is
const getDueStatus = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    // normalize to end of due day so "due today" doesn't read as overdue
    due.setHours(23, 59, 59, 999);

    const diffMs = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs < 0) {
        return {
            label: "Overdue",
            icon: AlertTriangle,
            classes: "text-red-700 bg-red-50 border-red-200",
        };
    }
    if (diffDays <= 2) {
        return {
            label: diffDays === 0 ? "Due today" : `Due in ${diffDays}d`,
            icon: Clock,
            classes: "text-amber-700 bg-amber-50 border-amber-200",
        };
    }
    return {
        label: `Due ${formatDate(dueDate)}`,
        icon: CheckCircle2,
        classes: "text-emerald-700 bg-emerald-50 border-emerald-200",
    };
};

function StudentAssignment({ classroomId }) {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAssignment = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getAssignment(classroomId);
                setAssignments(res.data);
            } catch (err) {
                console.log(err);
                setError("Failed to load assignments");
            } finally {
                setLoading(false);
            }
        };
        fetchAssignment();
    }, [classroomId]);

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <FileText size={18} className="text-indigo-600" />
                    Assignments
                </h2>

                {loading && (
                    <div className="space-y-3">
                        {[0, 1].map((i) => (
                            <div
                                key={i}
                                className="animate-pulse h-20 rounded-xl bg-gray-100"
                            />
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}

                {!loading && !error && assignments.length === 0 && (
                    <div className="text-center py-10">
                        <FileText size={28} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-sm text-gray-500">
                            No assignments have been posted yet.
                        </p>
                    </div>
                )}

                {!loading && !error && assignments.length > 0 && (
                    <ul className="divide-y divide-gray-100">
                        {assignments.map((a) => {
                            const status = getDueStatus(a.dueDate);
                            const StatusIcon = status.icon;

                            return (
                                <li key={a.id} className="py-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-semibold text-gray-800">
                                                {a.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1 whitespace-pre-line">
                                                {a.description}
                                            </p>

                                            {a.file && (
                                                <a
                                                    href={fileUrl(a.file)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                                                >
                                                    <Paperclip size={13} />
                                                    View attachment
                                                </a>
                                            )}
                                        </div>

                                        <span
                                            className={`flex items-center gap-1 text-xs font-medium border rounded-full px-2.5 py-1 whitespace-nowrap shrink-0 ${status.classes}`}
                                        >
                                            <StatusIcon size={12} />
                                            {status.label}
                                        </span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default StudentAssignment;