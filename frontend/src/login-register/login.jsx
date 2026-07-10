
import { useState } from "react";
import {useNavigate } from "react-router-dom"
import { loginUser } from "../api/registerApi";
import { useAuth } from "../context/authContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState();
    const navigate = useNavigate();
    const { login } = useAuth();

    const goRegister = () => {
        navigate("/register")
    }
    

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await loginUser({
                Email: email,
                Password: password
            });
            console.log(res)
            login(res.data.token);

            switch (res.data.role) {
                case "Admin":
                    navigate("/classroom");
                    break;

                case "Teacher":
                    navigate("/classroom");
                    break;

                case "Student":
                    navigate(`/studentClassroom`);
                    break;

                default:
                    navigate("/");
                    break;
            }
        } catch (err) {
            setError(err.response?.data?.message ?? "Login failed");
        }
    };
    return (
        <div>
            <form onSubmit={handleLogin}>
                <input className="bg-gray-100" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="bg-gray-100" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {error && (<p>{error}</p>)}
                <button type="submit">Login</button>
            </form>

            <button onClick={goRegister}> register</button>
        </div>
    )
}
export default Login