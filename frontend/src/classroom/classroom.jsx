import { useEffect, useState } from "react"
import { createClassroom, deleteClassroom, getClassroom } from "../api/classroomApi"
import {useNavigate } from "react-router-dom"
import { searchTeacher } from "../api/teacherApi"

function Classroom() {
    const [classroomForm, setClassroomForm] = useState({
        AdvisorId: null,
        Subject: '',
        GradeLevel: '',
        Section: ''
    })
    const [createClassroomMessage, setCreateClassroomMessage] = useState("")
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

    useEffect(() => {
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
        fetchClassroom()
    }, [])

    const handleChange = (e) => {
        setClassroomForm({ ...classroomForm, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            
            const res = await createClassroom(classroomForm)
            setCreateClassroomMessage(res.data.message)
        } catch (err) {
            console.log(err)
        }
    }
    const handleGoToClassroom = (ClassroomId) => {
        try {
            navigate(`/classroom/${ClassroomId}`)
        } catch (err) {
            console.log(err)
        }
    }
    const handleDeleteClassroom = async (ClassroomId) => {
        try {
            console.log(ClassroomId);
            const res = await deleteClassroom(ClassroomId)
        } catch (err) {
            console.log(err)
        }
    }

    const classRender = (classroom) => {
        return classroom.map((c) => {
            return (

                <div className="border-1 my-10" key={c.id}>
                    <p>Advisor: {c.advisor?.name}</p>
                    <p>Subject: {c.subject}</p>
                    <p>Grade Level: {c.gradeLevel}</p>
                    <p>Section: {c.section}</p>
                    <button className="px-10 bg-blue-400" onClick={() => handleGoToClassroom(c.id)} >Go to classroom</button>
                        <button className="cursor-pointer px-10 bg-red-200" onClick={() => handleDeleteClassroom(c.id)}>Delete classroom</button>
                    </div>

            )
        })
    }
    const handleSelectAdvisor = (advisor) => {
        setSelectedAdvisor(advisor.id); // or advisor.name
        setSearch(advisor.name);        // show the selected name in the input
        setSearchedAdvisor([]);         // hide the dropdown

        setClassroomForm(prev => ({
            ...prev,
            AdvisorId: advisor.id       // or advisor.id if your backend expects an ID
        }));
    };
    const isSelected = (id) => selectedAdvisor === id;
    const searchRender = (searchedAdvisor) => {
        return searchedAdvisor.map((s) => {
            return (
                <div key={s.id} onClick={() => handleSelectAdvisor(s)} className={isSelected(s.id) ? 'bg-gray-200' : ''}>{s.name}</div>
            )
        })
    }
    return (
        <div>
            Create Classroom
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Advisor:</label>
                    <input type="text"  value={search} onChange={(e) => setSearch(e.target.value)} />
                    <div>
                        {searchRender(searchedAdvisor)}
                    </div>
                </div>
                <div>
                    <label>Subject:</label>
                    <input type="text" name="Subject" value={classroomForm.Subject} onChange={handleChange} />
                </div>
                <div>
                    <label>Grade Level:</label>
                    <input type="text" name="GradeLevel" value={classroomForm.GradeLevel} onChange={handleChange} />
                </div>
                <div>
                    <label>Section:</label>
                    <input type="text" name="Section" value={classroomForm.Section} onChange={handleChange} />
                </div>
                <button type="submit">Create classroom</button>
                {createClassroomMessage && (<p>{createClassroomMessage}</p>)}
            </form>
            <div>
                {classroomLoading ? "Loading" :  classRender(classroom) }
            </div>
           
        </div>
    )
}

export default Classroom