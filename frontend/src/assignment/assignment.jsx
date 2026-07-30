import { createAssignment, deleteAssignment, getAssignment, /*, updateAssignment, deleteAssignment */ 
updateAssignment} from "../api/assignmentApi";

import { useState, useRef, useEffect } from "react";
import { FileText, CalendarClock, Paperclip, MoreVertical, Pencil, Trash2, Plus, X, XCircle } from "lucide-react";

function Assignment({ classroomId }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [file, setFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Edit mode state
    const [editingId, setEditingId] = useState(null); // null = create mode, otherwise = assignment.id being edited
    const [existingFile, setExistingFile] = useState(null); // the current file path from server, if any
    const [removeExisting, setRemoveExisting] = useState(false); // user chose to remove the existing attachment

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

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setDueDate("");
        setFile(null);
        setExistingFile(null);
        setRemoveExisting(false);
        setEditingId(null);
    };

    // --- Edit handler: populate form with the clicked assignment's data ---
    const handleEdit = (assignment) => {
        setEditingId(assignment.id);
        setTitle(assignment.title);
        setDescription(assignment.description);
        setDueDate(toDatetimeLocalValue(assignment.dueDate)); // handles Date objects, ISO strings, and date-only strings
        setExistingFile(assignment.file || null);
        setRemoveExisting(false);
        setFile(null);

        window.scrollTo({ top: 1300, behavior: "smooth" });
    };

    const handleCancelEdit = () => {
        resetForm();
    };

    // --- Delete handler ---
    const handleDelete = async (assignment) => {
        if (!window.confirm(`Delete "${assignment.title}"? This cannot be undone.`)) return;
        try {
            await deleteAssignment(assignment.id)
            fetchAssignment();
        } catch (err) {
            console.log(err);
            alert("Failed to delete assignment");
        }
    };

    // --- Create or Update submit ---
    const submit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData();
        formData.append("Title", title);
        formData.append("Description", description);
        formData.append("DueDate", dueDate);
        formData.append("ClassroomId", classroomId);

        if (file) {
            formData.append("File", file);
        }

        if (editingId) {
            // tell backend whether to clear the existing file (removed + no replacement)
            formData.append("Id", editingId);
            formData.append("RemoveFile", removeExisting && !file ? "true" : "false");
        }

        try {
            if (editingId) {

                await updateAssignment(formData);
                alert("Assignment updated!");
            } else {
                await createAssignment(formData);
                alert("Assignment created!");
            }
            resetForm();
            fetchAssignment();
        } catch (err) {
            console.log(err);
            alert(editingId ? "Failed to update assignment" : "Failed to create assignment");
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

    const toDatetimeLocalValue = (value) => {
        if (!value) return "";
        const d = new Date(value);
        if (isNaN(d.getTime())) return "";
        const pad = (n) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    // adjust base URL to match your backend static file server
    const fileUrl = (path) => `http://localhost:5125/${path}`;

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-8">
            {/* Create / Edit form */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        {editingId ? (
                            <Pencil size={20} className="text-indigo-600" />
                        ) : (
                            <Plus size={20} className="text-indigo-600" />
                        )}
                        {editingId ? "Edit Assignment" : "Create Assignment"}
                    </h1>

                    {editingId && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                        >
                            <X size={14} />
                            Cancel
                        </button>
                    )}
                </div>

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
                            Attachment {editingId ? "" : "(optional)"}
                        </label>

                        {/* Editing an assignment that has an existing attachment, not yet removed */}
                        {editingId && existingFile && !removeExisting && !file && (
                            <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 text-sm">
                                <a
                                    href={fileUrl(existingFile)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-indigo-600 hover:underline"
                                >
                                    <Paperclip size={13} />
                                    Current attachment
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setRemoveExisting(true)}
                                    className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-medium"
                                >
                                    <XCircle size={13} />
                                    Remove
                                </button>
                            </div>
                        )}

                    {/* Existing attachment removed, but a new one hasn't been picked yet -> show file input */}
                    {(!editingId || removeExisting || !existingFile || file) && (
                        <div className="space-y-1">
                            <input
                                type="file"
                                onChange={(e) => {
                                    setFile(e.target.files[0]);
                                    setRemoveExisting(false); // picking a new file supersedes removal
                                }}
                                className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-600 file:text-sm file:font-medium hover:file:bg-indigo-100"
                            />
                            {editingId && removeExisting && !file && (
                                <p className="text-xs text-gray-400">
                                    Attachment will be removed on save. Choose a file above to replace it instead.
                                </p>
                            )}
                        </div>
                    )}
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg px-4 py-2 transition-colors"
            >
                {submitting ? (editingId ? "Saving..." : "Creating...") : (editingId ? "Save Changes" : "Create")}
            </button>
        </form>
            </div >

        {/* Assignment list */ }
        < div className = "bg-white border border-gray-200 rounded-2xl shadow-sm p-6" >
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <FileText size={18} className="text-indigo-600" />
                Assignments
            </h2>

    { loading && <p className="text-sm text-gray-500">Loading assignments...</p> }
    { error && <p className="text-sm text-red-500">{error}</p> }
    {
        !loading && !error && assignments.length === 0 && (
            <p className="text-sm text-gray-500">No assignments yet.</p>
        )
    }

    {
        !loading && !error && assignments.length > 0 && (
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

                            <div className="flex items-center gap-2 shrink-0">
                                <span className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1 whitespace-nowrap">
                                    <CalendarClock size={12} />
                                    Due {formatDate(a.dueDate)}
                                </span>

                                <AssignmentMenu
                                    assignment={a}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            </div>
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
        ))
    }
                    </ul >
                )
}
            </div >
        </div >
    );
}

export default Assignment;


// Small reusable menu component for each assignment row
function AssignmentMenu({ assignment, onEdit, onDelete }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={menuRef} className="relative">
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <MoreVertical size={16} />
            </button>

            {open && (
                <div className="absolute right-0 top-7 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    <button
                        onClick={() => {
                            setOpen(false);
                            onEdit(assignment);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <Pencil size={14} />
                        Edit
                    </button>
                    <button
                        onClick={() => {
                            setOpen(false);
                            onDelete(assignment);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 size={14} />
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}