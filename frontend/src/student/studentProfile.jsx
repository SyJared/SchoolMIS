import { useEffect, useState } from "react";
import {useParams } from "react-router-dom"
import { getStudentInfoById, putStudentInfo } from "../api/studentsApi";
function StudentProfile() {
    const [image, setImage] = useState(null);
    const [city, setCity] = useState("");
    const [municipality, setMunicipality] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const [studentInfo, setStudentInfo] = useState({});
    const { studentId } = useParams();

    useEffect(() => {
        const fetchSelfInfo = async () => {
            try {
                const res = await getStudentInfoById(studentId);

                setStudentInfo(res.data);
                console.log(res)
                setCity(res.data.city || "");
                setMunicipality(res.data.municipality || "");
                setBirthdate(
                    res.data.birthdate
                        ? res.data.birthdate.substring(0, 10)
                        : ""
                );
                setContactNumber(res.data.contactNumber || "");
            } catch (err) {
                console.log(err)
            }
        }
        fetchSelfInfo()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("ProfileImage", image);
        formData.append("City", city);
        formData.append("Municipality", municipality);
        formData.append("Birthdate", birthdate);
        formData.append("ContactNumber", contactNumber);
        formData.append("Id", studentId);
        try {
            await putStudentInfo(formData);

            const res = await getStudentInfoById(studentId);

            setStudentInfo(res.data);

            setIsEditing(false);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">
                Student Profile
            </h1>

            {!isEditing ? (
                <>
                    {studentInfo.profileImage && (
                        <img
                            src={`http://localhost:5125/uploads/profile/${studentInfo.profileImage}`}
                            className="w-32 h-32 rounded-full object-cover mb-4"
                        />
                    )}

                    <p><strong>City:</strong> {studentInfo.city}</p>

                    <p><strong>Municipality:</strong> {studentInfo.municipality}</p>

                    <p><strong>Birthdate:</strong> {studentInfo.birthdate?.substring(0, 10)}</p>

                    <p><strong>Contact:</strong> {studentInfo.contactNumber}</p>

                    <button
                        onClick={() => setIsEditing(true)}
                        className="mt-5 bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Edit Profile
                    </button>
                </>
            ) : (
                <form onSubmit={handleSubmit}>
                    {/* your current form goes here */}

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Save
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                </form>
            )}
        </div>
    );
}

export default StudentProfile;