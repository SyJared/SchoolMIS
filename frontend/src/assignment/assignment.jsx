import { useEffect, useState } from "react";
import { createAssignment, getAssignment } from "../api/assignmentApi";
import { FileText, CalendarClock, Paperclip, Plus } from "lucide-react";

function Assignment({ classroomId }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [file, setFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAssignment = async () => {
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

    useEffect(() => {
        fetchAssignment();
    }, [classroomId]);

    const submit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData();
        formData.append("Title", title);
        formData.append("Description", description);
        formData.append("DueDate", dueDate);
        formData.append("ClassroomId", classroomId);
        if (file) formData.append("File", file);

        try {
            await createAssignment(formData);
            alert("Assignment created!");
            setTitle("");
            setDescription("");
            setDueDate("");
            setFile(null);
            fetchAssignment(); // refresh list after creating
        } catch (err) {
            console.log(err);
            alert("Failed to create assignment");
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (d) =>
        new Date(d).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    // adjust base URL to match your backend static file server
    const fileUrl = (path) => `http://localhost:5125/${path}`;

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-8">
            {/* Create form */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h1 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Plus size={20} className="text-indigo-600" />
                    Create Assignment
                </h1>

                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            placeholder="e.g. Create a resume"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            placeholder="Assignment details..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Due Date
                        </label>
                        <input
                            type="datetime-local"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Attachment (optional)
                        </label>
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-600 file:text-sm file:font-medium hover:file:bg-indigo-100"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg px-4 py-2 transition-colors"
                    >
                        {submitting ? "Creating..." : "Create"}
                    </button>
                </form>
            </div>

            {/* Assignment list */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <FileText size={18} className="text-indigo-600" />
                    Assignments
                </h2>

                {loading && <p className="text-sm text-gray-500">Loading assignments...</p>}
                {error && <p className="text-sm text-red-500">{error}</p>}
                {!loading && !error && assignments.length === 0 && (
                    <p className="text-sm text-gray-500">No assignments yet.</p>
                )}

                {!loading && !error && assignments.length > 0 && (
                    <ul className="divide-y divide-gray-100">
                        {assignments.map((a) => (
                            <li key={a.id} className="py-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-sm font-semibold text-gray-800">
                                            {a.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {a.description}
                                        </p>
                                    </div>
                                    <span className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1 whitespace-nowrap">
                                        <CalendarClock size={12} />
                                        Due {formatDate(a.dueDate)}
                                    </span>
                                </div>

                                {a.file && (
                                    <a
                                    href = { fileUrl(a.file)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                                >
                                <Paperclip size={13} />
                                View attachment
                            </a>
                        )}
                    </li>
                ))}
            </ul>
                )}
        </div>
        </div >
    );
}

export default Assignment;