import { useEffect, useState } from "react"
import { createStudents, deleteStudents, editStudents, getStudents } from "../api/studentsApi";

function Student() {
    const [students, setStudents] = useState([]);
    const [studentLoading, setStudentLoading] = useState(true)

    const [name, setName] = useState()

    const [isEditting, setIsEditting] = useState("")
    const [editName, setEditName] = useState("")

    
    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const res = await getStudents()
                setStudents(res.data);
            } catch (err) {
                console.log(err)
            } finally {
                setStudentLoading(false)
            }
        }

        fetchStudent()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const res = await createStudents({ name });

            setStudents((s) => [...s, {id: res.id, name: res.name}])
        } catch (err) {
            console.log(err)
        }
    };
    const handleDelete = async (id) => {
        try {
            const res = await deleteStudents({ Id: id });
            console.log(students)
            setStudents((s) => s.filter((student) => student.id !== id));
        } catch (err) {
            console.log(err)
        }
    }
    const handleEdit = async (id) => {
        try {
            const res = editStudents({ Id: id, editName })
            console.log(res)
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div>
           <div>

            <div>
            student
            </div>
                <div>
                    {studentLoading ? "loading" 
                        : students.map(s => (
                            <div key={s.id}><div>{s.name}</div>
                                <button onClick={() => handleDelete(s.id)} className="bg-red-500 px-10">delete</button>
                                <button className="px-10 bg-orange-500" onClick={() => setIsEditting(s.id)}>Edit</button>
                                {isEditting === s.id && (
                                 <><input type="text" className="bg-gray-200" value={editName} onChange={(e) => setEditName(e.target.value)} />
                                 <button  className="bg-green-200" onClick={() => handleEdit(s.id)}>save</button></>)}
                            </div>
                        )) }
                </div>
                <form onSubmit={handleSubmit}>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    <button>submit</button>
                </form>
            </div>


        </div>
    )
}

export default Student