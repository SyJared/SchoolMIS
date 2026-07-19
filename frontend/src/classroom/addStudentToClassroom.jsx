import { useEffect, useState } from "react"
import { getStudents } from "../api/studentsApi";
import { addStudentInC, getStudentOfClassroom } from "../api/classroomStudentApi";
import { Search, UserPlus, Check } from "lucide-react";

function AddStudentToClassroom({ ClassroomId }) {
    const [searchedStudent, setSearchedStudent] = useState([]);
    const [search, setSearch] = useState("")

    const [selectedStudent, setSelectedStudent] = useState()
    const [addMessage, setAddMessage] = useState();

    const [students, setStudents] = useState([])
    const [adding, setAdding] = useState(false)

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const res = await getStudentOfClassroom(ClassroomId)
                setStudents(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchStudent()
    }, [ClassroomId])

    useEffect(() => {
        if (search.trim() === "") {
            setSearchedStudent([]);
            return;
        }
        const timer = setTimeout(async () => {
            try {
                const res = await getStudents(search);
                setSearchedStudent(res.data);
            } catch (err) {
                console.log(err);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const isSelected = (id) => selectedStudent === id;

    const searchMap = (searchStudent) => {
        return searchStudent.map((s) => (
            <div
                key={s.id}
                onClick={() => setSelectedStudent(s.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${isSelected(s.id)
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
            >
                <span>{s.name}</span>
                {isSelected(s.id) && <Check size={14} className="text-indigo-600" />}
            </div>
        ))
    }

    const addStudent = async () => {
        if (!selectedStudent) return;
        setAdding(true);
        try {
            const res = await addStudentInC({ StudentId: selectedStudent, ClassroomId: parseInt(ClassroomId) });
            setAddMessage(res.data.message)
        } catch (err) {
            console.log(err.response?.data?.message)
            setAddMessage(err.response?.data?.message ?? "Something went wrong")
        } finally {
            setAdding(false);
        }
    }

    return (
        <div className="space-y-4">
            {/* Search */}
            <div>
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search student by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="mt-2 border border-gray-100 rounded-lg divide-y divide-gray-50 max-h-48 overflow-y-auto">
                    {searchedStudent.length === 0 ? (
                        <p className="text-sm text-gray-400 px-3 py-3">
                            {search.trim() === "" ? "Search for a student" : "No results found"}
                        </p>
                    ) : (
                        searchMap(searchedStudent)
                    )}
                </div>

                <div className="mt-3 flex items-center gap-3">
                    <button
                        onClick={addStudent}
                        disabled={!selectedStudent || adding}
                        className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
                    >
                        <UserPlus size={15} />
                        {adding ? "Adding..." : "Add student"}
                    </button>
                    {addMessage && (
                        <p className="text-sm text-gray-600">{addMessage}</p>
                    )}
                </div>
            </div>

            {/* Existing students */}
            <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Enrolled Students</h3>
                {students.length === 0 ? (
                    <p className="text-sm text-gray-400">No students enrolled yet.</p>
                ) : (
                    <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg">
                        {students.map((s) => (
                            <li key={s.id} className="px-3 py-2 text-sm text-gray-700">
                                {s.student.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
export default AddStudentToClassroom