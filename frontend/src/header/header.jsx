import { useNavigate } from "react-router-dom" 
function Header() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
   
    return (

        <header className="flex absolute sticky h-15 justify-between bg-blue-500 ">
            <div>
            SCHOOLMIS
            </div>
            {token ? <><nav>
                <span onClick={() => navigate("/classroom")}>Classroom</span>
                <span onClick={() => navigate("/students")}>Students</span>
            </nav><div>
                    logout
                </div></> : null}
        </header>
    )
}
export default Header