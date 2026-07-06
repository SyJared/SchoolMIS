    import { useEffect, useState } from "react";
    import { createClass, getAllClass } from "../api/classApi";


    function CreateClass({ ClassroomId }) {
        const [start, setStart] = useState('');
        const [end, setEnd] = useState('');
        const [loading, setLoading] = useState(true);
        const [classes, setClasses] = useState([]);

        useEffect(() => {
            const fetchClass = async () => {
                try {
                    const res = await getAllClass();
                    setClasses(res.data);
                } catch (err) {
                    console.log(err);
                } finally {
                    setLoading(false);
                }
            }
            fetchClass();
        },[])

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                console.log(start, end);
                const res = await createClass({ ClassroomId, Start: start, End:end})
        
            } catch (err) {
                console.log(err)
            }
        }
        const classRender = (classes) => {
            return classes.map((c) => {
                return (
                    <div key={c.id}>
                        <h1>{ c.isDone ?"Class ended" : "Please be ready for the class"}</h1>
                        <span>Start :{c.start}</span>
                        <span>End :{c.end}</span>
                    </div>
                )
            })
        }
        return (
            <div>
            <form onSubmit={handleSubmit} className="border-1">
                <span>Start</span>
                <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
                <span>End</span>
                <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
                <button type="submit">Submit</button>
                </form>

                <div>
                    {!loading && classRender(classes)}
                </div>
            </div>
        )
    }
    export default CreateClass