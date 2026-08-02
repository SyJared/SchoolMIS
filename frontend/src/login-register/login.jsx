import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { loginUser } from "../api/registerApi";
import { useAuth } from "../context/authContext";
import { LogIn, Mail, Lock, GraduationCap } from "lucide-react";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState();
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { user, login } = useAuth();

    const goRegister = () => {
        navigate("/register")
    }

    const goToDashboard = (role) => {
        switch (role) {
            case "Admin":
                navigate("/adminDashboard");
                break;
            case "Teacher":
                navigate("/teacherDashboard");
                break;
            case "Student":
                navigate(`/studentDashboard`);
                break;
            default:
                navigate("/");
                break;
        }
    };

    // if already logged in (e.g. token persisted from a previous session), skip the login form
    useEffect(() => {
        if (user) {
            goToDashboard(user.role);
        }
    }, [user]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const res = await loginUser({
                Email: email,
                Password: password
            });
            login(res.data.token);
            goToDashboard(res.data.role);
        } catch (err) {
            setError(err.response?.data?.message ?? "Login failed");
        } finally {
            setSubmitting(false);
        }
    };

    // avoid flashing the login form while we check/redirect an already-logged-in user
    if (user) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-sm">
                <div className="flex items-center justify-center gap-2 mb-6">
                    <GraduationCap size={28} className="text-indigo-600" />
                    <span className="text-xl font-bold text-gray-900">EduPortal</span>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                    <h1 className="text-lg font-bold text-gray-900 mb-1">Welcome back</h1>
                    <p className="text-sm text-gray-500 mb-6">Log in to your account</p>

                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
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

                        {error && (
                            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium text-sm rounded-lg px-4 py-2.5 transition-colors"
                        >
                            <LogIn size={16} />
                            {submitting ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account?{" "}
                    <button onClick={goRegister} className="text-indigo-600 font-medium hover:underline">
                        Register
                    </button>
                </p>
            </div>
        </div>
    )
}
export default Login