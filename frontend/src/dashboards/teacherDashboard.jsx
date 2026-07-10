import { useEffect } from "react";

import { getTeacherClassroom } from "../api/classroomApi";
import { useAuth } from "../context/authContext";
function TeacherDashboard() {
    const { user } = useAuth();
 
    useEffect(() => {
        
        
        const fetchClassroom = async () => {
            
            try {

                const res = await getTeacherClassroom()
                console.log(res)
            } catch (err) {
                console.log(err)
            }
        }
        fetchClassroom()
    },[])
    return (
        <div>TEACHER DASHBAORD</div>
    )
}
export default TeacherDashboard