import { useEffect, useState } from "react"
import { getStudents } from "../api/studentsApi";
import { addStudentInC, getStudentOfClassroom } from "../api/classroomStudentApi";
import { useParams } from "react-router-dom";

function AddStudentToClassroom({ ClassroomId }) {
    const [searchedStudent, setSearchedStudent] = useState([]);
    const [search, setSearch] = useState("")
    
    const [selectedStudent, setSelectedStudent] = useState()
    const [addMessage, setAddMessage] = useState();

    const [students, setStudents] = useState([])
    useEffect(() => {
        const fetchStudent = async() => {
            try {
                const res = await getStudentOfClassroom(ClassroomId)
                setStudents(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchStudent()
    },[])

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

    const isSelected = (id) => {
        if (selectedStudent === id) {
            return true
        }return false
    }
    const searchMap = (searchStudent) => {
        return searchStudent.map((s) => {
            return (
                <div className={`${isSelected(s.id) ? "bg-gray-200" :''}`} key={s.id} onClick={() => setSelectedStudent(s.id)}>{s.name}</div>
            )
        })
    }
    const addStudent = async () => {
        try {
            const res = await addStudentInC({ StudentId: selectedStudent, ClassroomId: parseInt(ClassroomId) });
            setAddMessage(res.data.message)
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div className="border-1">
            <h1>Add Student</h1>

            <div>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
                <div>
                    {searchedStudent.length === 0
                        ? "search for student"
                        : searchMap(searchedStudent)}

                    <button onClick={() => addStudent()}>Add student</button>
                    {addMessage && (<p>{addMessage}</p>)}
                </div>
                <div>
                    {students.map((s) => {
                        return (
                            <div key={s.id}>{s.student.name}</div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
export default AddStudentToClassroom