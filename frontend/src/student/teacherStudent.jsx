import { useEffect, useState, useMemo } from "react"
import { getMyStudents } from "../api/classroomStudentApi"
import { Users, Search, School } from "lucide-react"

function TeacherStudents() {
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState("")

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await getMyStudents()
                setStudents(res.data)
            } catch (err) {
                console.log(err)
                setError("Failed to load students")
            } finally {
                setLoading(false)
            }
        }
        fetchStudents()
    }, [])

    const filtered = useMemo(() => {
        if (!search.trim()) return students
        const q = search.toLowerCase()
        return students.filter(
            (s) =>
                s.studentName.toLowerCase().includes(q) ||
                s.subject.toLowerCase().includes(q) ||
                s.section.toLowerCase().includes(q)
        )
    }, [students, search])

    // group by classroom
    const grouped = useMemo(() => {
        const map = {}
        filtered.forEach((s) => {
            const key = s.classroomId
            if (!map[key]) {
                map[key] = {
                    classroomId: s.classroomId,
                    subject: s.subject,
                    gradeLevel: s.gradeLevel,
                    section: s.section,
                    students: [],
                }
            }
            map[key].students.push(s)
        })
        return Object.values(map)
    }, [filtered])

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Users size={22} className="text-indigo-600" />
                    My Students
                </h1>
                <span className="text-sm text-gray-500">
                    {students.length} student{students.length !== 1 && "s"}
                </span>
            </div>

            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by student name, subject, or section..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {loading && <p className="text-sm text-gray-500">Loading students...</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
            {!loading && !error && grouped.length === 0 && (
                <p className="text-sm text-gray-500">No students found.</p>
            )}

            <div className="space-y-4">
                {grouped.map((g) => (
                    <div key={g.classroomId} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                        <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-4">
                            <School size={16} className="text-indigo-600" />
                            {g.subject} &middot; Grade {g.gradeLevel} - {g.section}
                            <span className="ml-auto text-xs font-normal text-gray-400">
                                {g.students.length} student{g.students.length !== 1 && "s"}
                            </span>
                        </h2>

                        <ul className="divide-y divide-gray-100">
                            {g.students.map((s) => (
                                <li key={s.studentId} className="py-2.5 flex items-center gap-2 text-sm text-gray-700">
                                    <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-semibold">
                                        {s.studentName.charAt(0).toUpperCase()}
                                    </div>
                                    {s.studentName}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TeacherStudents