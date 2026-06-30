
import { useState } from "react";
import {useNavigate } from "react-router-dom"
import { login } from "../api/registerApi";
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState();
    const navigate = useNavigate();

    const goRegister = () => {
        navigate("/register")
    }
    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            console.log(email,password)
            await login({
                Email: email,
                Password: password
            })
            navigate("/classroom")
        } catch (err) {
            setError(err.response.data.message)
            console.log(err)
        }
    }
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