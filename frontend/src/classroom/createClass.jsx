import { useState } from "react";
import { createClass } from "../api/classApi";

function CreateClass({ ClassroomId }) {
    const [start, setStart] = useState();
    const [end, setEnd] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await createClass({ ClassroomId, Start: start, End:end });
            console.log(res)
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <form onSubmit={handleSubmit} className="border-1">
            <span>Start</span>
            <input type="datetime-local" />
            <span>End</span>
            <input type="datetime-local" />
            <button type="submit">Submit</button>
        </form>
    )
}
export default CreateClass