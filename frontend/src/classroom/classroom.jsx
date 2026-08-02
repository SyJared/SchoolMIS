import { useEffect, useState } from "react"
import { createClassroom, deleteClassroom, getClassroom } from "../api/classroomApi"
import { useNavigate } from "react-router-dom"
import { searchTeacher } from "../api/teacherApi"
import { useAuth } from "../context/authContext"
import { School, Search, Trash2, ArrowRight, Plus, User } from "lucide-react"

function Classroom() {
    const { user } = useAuth();
    const isAdmin = user?.role === "Admin";

    const [classroomForm, setClassroomForm] = useState({
        AdvisorId: null,
        Subject: '',
        GradeLevel: '',
        Section: ''
    })
    const [createClassroomMessage, setCreateClassroomMessage] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [classroom, setClassroom] = useState([])
    const [classroomLoading, setClassroomLoading] = useState(true)
    const [search, setSearch] = useState("");
    const [searchedAdvisor, setSearchedAdvisor] = useState([]);
    const [selectedAdvisor, setSelectedAdvisor] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (search.trim() == "") {
            setSearchedAdvisor([]);
            return;
        }
        const timer = setTimeout(async () => {
            try {
                const res = await searchTeacher(search);
                setSearchedAdvisor(res.data)
            } catch (err) {
                console.log(err)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [search])

    const fetchClassroom = async () => {
        try {
            const res = await getClassroom();
            setClassroom(res.data.classrooms)
        } catch (err) {
            console.log(err)
        } finally {
            setClassroomLoading(false)
        }
    }

    useEffect(() => {
        fetchClassroom()
    }, [])

    const handleChange = (e) => {
        setClassroomForm({ ...classroomForm, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const res = await createClassroom(classroomForm)
            setCreateClassroomMessage(res.data.message)
            setClassroomForm({ AdvisorId: null, Subject: '', GradeLevel: '', Section: '' })
            setSearch("")
            setSelectedAdvisor(null)
            fetchClassroom()
        } catch (err) {
            console.log(err)
            setCreateClassroomMessage("Failed to create classroom")
        } finally {
            setSubmitting(false)
        }
    }

    const handleGoToClassroom = (ClassroomId) => {
        try {
            navigate(`/classroom/${ClassroomId}`)
        } catch (err) {
            console.log(err)
        }
    }

    const handleDeleteClassroom = async (e, ClassroomId) => {
        e.stopPropagation();
        if (!window.confirm("Delete this classroom? This cannot be undone.")) return;
        try {
            await deleteClassroom(ClassroomId)
            fetchClassroom()
        } catch (err) {
            console.log(err)
        }
    }

    const handleSelectAdvisor = (advisor) => {
        setSelectedAdvisor(advisor.id);
        setSearch(advisor.name);
        setSearchedAdvisor([]);
        setClassroomForm(prev => ({ ...prev, AdvisorId: advisor.id }));
    };

    const isSelected = (id) => selectedAdvisor === id;

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <School size={22} className="text-indigo-600" />
                Classrooms
            </h1>

            {/* Create classroom — Admin only */}
            {isAdmin && (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                        <Plus size={18} className="text-indigo-600" />
                        Create Classroom
                    </h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Advisor</label>
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search teacher by name..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            {searchedAdvisor.length > 0 && (
                                <div className="mt-1 border border-gray-100 rounded-lg divide-y divide-gray-50 max-h-40 overflow-y-auto">
                                    {searchedAdvisor.map((s) => (
                                        <div
                                            key={s.id}
                                            onClick={() => handleSelectAdvisor(s)}
                                            className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors ${isSelected(s.id) ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-50 text-gray-700"
                                                }`}
                                        >
                                            <User size={13} className="text-gray-400" />
                                            {s.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    name="Subject"
                                    value={classroomForm.Subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                                <input
                                    type="text"
                                    name="GradeLevel"
                                    value={classroomForm.GradeLevel}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                                <input
                                    type="text"
                                    name="Section"
                                    value={classroomForm.Section}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="self-start bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium text-sm rounded-lg px-4 py-2 transition-colors"
                        >
                            {submitting ? "Creating..." : "Create Classroom"}
                        </button>

                        {createClassroomMessage && (
                            <p className="text-sm text-gray-600">{createClassroomMessage}</p>
                        )}
                    </form>
                </div>
            )}

            {/* Classroom list */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">All Classrooms</h2>

                {classroomLoading ? (
                    <p className="text-sm text-gray-500">Loading classrooms...</p>
                ) : classroom.length === 0 ? (
                    <p className="text-sm text-gray-500">No classrooms yet.</p>
                ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                        {classroom.map((c) => (
                            <div
                                key={c.id}
                                onClick={() => handleGoToClassroom(c.id)}
                                className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm cursor-pointer transition-all"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{c.subject}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Grade {c.gradeLevel} &middot; Section {c.section}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                            <User size={12} />
                                            {c.advisor?.name ?? "No advisor"}
                                        </p>
                                    </div>

                                    {isAdmin && (
                                        <button
                                            onClick={(e) => handleDeleteClassroom(e, c.id)}
                                            className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    )}
                                </div>

                                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-indigo-600">
                                    Go to classroom <ArrowRight size={12} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Classroom