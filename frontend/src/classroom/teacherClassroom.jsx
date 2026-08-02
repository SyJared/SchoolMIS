import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getMyClassrooms } from "../api/classroomApi"
import { School, User, ArrowRight } from "lucide-react"

function TeacherClassroom() {
    const [classrooms, setClassrooms] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const res = await getMyClassrooms()
                setClassrooms(res.data)
            } catch (err) {
                console.log(err)
                setError("Failed to load your classrooms")
            } finally {
                setLoading(false)
            }
        }
        fetchClassrooms()
    }, [])

    const handleGoToClassroom = (classroomId) => {
        navigate(`/classroom/${classroomId}`)
    }

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <School size={22} className="text-indigo-600" />
                My Classrooms
            </h1>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                {loading && <p className="text-sm text-gray-500">Loading classrooms...</p>}
                {error && <p className="text-sm text-red-500">{error}</p>}
                {!loading && !error && classrooms.length === 0 && (
                    <p className="text-sm text-gray-500">
                        You haven't been assigned as advisor to any classroom yet.
                    </p>
                )}

                {!loading && !error && classrooms.length > 0 && (
                    <div className="grid sm:grid-cols-2 gap-4">
                        {classrooms.map((c) => (
                            <div
                                key={c.id}
                                onClick={() => handleGoToClassroom(c.id)}
                                className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm cursor-pointer transition-all"
                            >
                                <p className="text-sm font-semibold text-gray-800">{c.subject}</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Grade {c.gradeLevel} &middot; Section {c.section}
                                </p>
                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                    <User size={12} />
                                    {c.advisorName}
                                </p>
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

export default TeacherClassroom