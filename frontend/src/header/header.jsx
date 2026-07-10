import { useNavigate } from "react-router-dom" 
import { useAuth } from "../context/authContext";
function Header() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const { user } = useAuth();

    return (

        <header className="flex absolute sticky h-15 justify-between bg-blue-500 ">
            <div>
            SCHOOLMIS
            </div>
            {token ? <><nav>
                <span onClick={() => navigate("/classroom")}>Classroom</span>
                <span onClick={() => navigate("/students")}>Students</span>
                <span onClick={() => navigate(`/studentProfile/${user.id}`)}>Profile</span>
            </nav><div>
                    logout
                </div></> : null}
        </header>
    )
}
export default Header