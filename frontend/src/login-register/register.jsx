import { useState } from "react";
import { register } from "../api/registerApi";
import { useNavigate } from "react-router-dom"


function Register() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [name, setName] = useState();
    const navigate = useNavigate()
    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            await register({
                Email: email,
                Name: name,
                Password: password
            })
            navigate("/")
        } catch(err) {
            console.log(err)
        }
    }
    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button>Register</button>
            </form>
        </div>
    )
}
export default Register