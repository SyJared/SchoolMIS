import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getStudentClassroomDetails } from '../api/classroomApi'
import { BookOpen, User, CalendarClock, CheckCircle2, XCircle, Clock, CalendarDays } from 'lucide-react'

function StudentClassroomDetails() {
    const { classroomId } = useParams()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchDatas = async () => {
            try {
                const res = await getStudentClassroomDetails(classroomId)
                setData(res.data)
            } catch (err) {
                console.log(err)
                setError("Failed to load classroom details")
            } finally {
                setLoading(false)
            }
        }
        fetchDatas()
    }, [classroomId])

    if (loading) return <div className="p-6 text-sm text-gray-500">Loading classroom details...</div>
    if (error) return <div className="p-6 text-sm text-red-500">{error}</div>
    if (!data) return <div className="p-6 text-sm text-gray-500">No classroom data found.</div>

    const { subject, gradeLevel, section, advisor, classes, attendance } = data

    // completed classes -> attach attendance status (default "Absent" if no record)
    const completedClasses = classes
        .filter((c) => c.isDone)
        .map((c) => {
            const record = attendance.find((a) => a.classId === c.classId)
            return { ...c, status: record ? record.status : "Absent" }
        })

    // upcoming classes -> no attendance status at all
    const upcomingClasses = classes.filter((c) => !c.isDone)

    const formatDateTime = (iso) =>
        new Date(iso).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        })

    const statusStyles = (status) => {
        if (status === "Present") return "bg-green-50 text-green-700 border-green-200"
        if (status === "Absent") return "bg-red-50 text-red-700 border-red-200"
        return "bg-gray-50 text-gray-500 border-gray-200"
    }

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            {/* Header card */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <BookOpen size={22} className="text-indigo-600" />
                            {subject}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Grade {gradeLevel} &middot; Section {section}
                        </p>
                    </div>
                    <span className="text-xs font-medium text-gray-400 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                        Classroom #{classroomId}
                    </span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                    <User size={16} className="text-gray-400" />
                    <span>Advisor: <span className="font-medium text-gray-800">{advisor}</span></span>
                </div>
            </div>

            {/* Upcoming sessions */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <CalendarDays size={18} className="text-blue-600" />
                    Upcoming Sessions
                </h2>

                {upcomingClasses.length === 0 ? (
                    <p className="text-sm text-gray-500">No upcoming sessions.</p>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {upcomingClasses.map((c) => (
                            <li key={c.classId} className="py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Clock size={16} className="text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            {formatDateTime(c.start)}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            ends {formatDateTime(c.end)}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-medium px-2.5 py-1 rounded-full border bg-blue-50 text-blue-600 border-blue-200">
                                    Upcoming
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Completed sessions + attendance */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                    <CalendarClock size={18} className="text-indigo-600" />
                    Completed Sessions
                </h2>

                {completedClasses.length === 0 ? (
                    <p className="text-sm text-gray-500">No completed sessions yet.</p>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {completedClasses.map((c) => (
                            <li key={c.classId} className="py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Clock size={16} className="text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            {formatDateTime(c.start)}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            ends {formatDateTime(c.end)}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyles(
                                        c.status
                                    )}`}
                                >
                                    {c.status === "Present" ? (
                                        <CheckCircle2 size={13} />
                                    ) : (
                                        <XCircle size={13} />
                                    )}
                                    {c.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default StudentClassroomDetails