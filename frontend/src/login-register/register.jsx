import { useState } from "react";
import { register } from "../api/registerApi";
import { useNavigate } from "react-router-dom"
import { UserPlus, Mail, Lock, User, GraduationCap } from "lucide-react";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate()
    const [message, setMessage] = useState();

    const handleRegister = async (e) => {
        e.preventDefault()
        setSubmitting(true);
        setMessage(null);
        try {
            await register({
                Email: email,
                Name: name,
                Password: password
            })
            navigate("/")
        } catch (err) {
            setMessage(err.response?.data?.message ?? "Registration failed")
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-sm">
                <div className="flex items-center justify-center gap-2 mb-6">
                    <GraduationCap size={28} className="text-indigo-600" />
                    <span className="text-xl font-bold text-gray-900">EduPortal</span>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                    <h1 className="text-lg font-bold text-gray-900 mb-1">Create an account</h1>
                    <p className="text-sm text-gray-500 mb-6">Register to get started</p>

                    <form onSubmit={handleRegister} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="Juan Dela Cruz"
                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="you@example.com"
                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        {message && (
                            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                {message}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium text-sm rounded-lg px-4 py-2.5 transition-colors"
                        >
                            <UserPlus size={16} />
                            {submitting ? "Creating account..." : "Register"}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{" "}
                    <button onClick={() => navigate("/")} className="text-indigo-600 font-medium hover:underline">
                        Login
                    </button>
                </p>
            </div>
        </div>
    )
}
export default Register