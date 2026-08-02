import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/authContext";
import Notification from "./notification";
import { GraduationCap, LayoutDashboard, School, Users, UserCircle, LogOut } from "lucide-react";

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const isActive = (path) => location.pathname === path;

    const navLinkClass = (path) =>
        `flex items-center gap-1.5 text-sm font-medium cursor-pointer transition-colors ${isActive(path) ? "text-white" : "text-indigo-100 hover:text-white"
        }`;

    const dashboardPath =
        user?.role === "Admin" ? "/adminDashboard" :
            user?.role === "Teacher" ? "/teacherDashboard" :
                user?.role === "Student" ? "/studentDashboard" : "/";

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between h-16 px-6 bg-indigo-600 shadow-sm">
            <div
                onClick={() => navigate(dashboardPath)}
                className="flex items-center gap-2 text-white font-bold text-lg cursor-pointer"
            >
                <GraduationCap size={22} />
                SCHOOLMIS
            </div>

            {user ? (
                <nav className="flex items-center gap-6">
                    <span onClick={() => navigate(dashboardPath)} className={navLinkClass(dashboardPath)}>
                        <LayoutDashboard size={16} />
                        Dashboard
                    </span>

                    {(user.role === "Admin" ) && (
                        <span onClick={() => navigate("/classroom")} className={navLinkClass("/classroom")}>
                            <School size={16} />
                            Classroom
                        </span>
                    )}
                    {( user.role === "Teacher") && (
                        <span onClick={() => navigate("/teacherClassroom")} className={navLinkClass("/teacherClassroom")}>
                            <School size={16} />
                            Classroom
                        </span>
                    )}

                    {user.role === "Student" && (
                        <span onClick={() => navigate("/studentClassroom")} className={navLinkClass("/studentClassroom")}>
                            <School size={16} />
                            My Classrooms
                        </span>
                    )}

                    {(user.role === "Admin" ) && (
                        <span onClick={() => navigate("/students")} className={navLinkClass("/students")}>
                            <Users size={16} />
                            Students
                        </span>
                    )}
                    {( user.role === "Teacher") && (
                        <span onClick={() => navigate("/teacherStudents")} className={navLinkClass("/teacherStudents")}>
                            <Users size={16} />
                            Students
                        </span>
                    )}

                    {user.role === "Student" && (
                        <span
                            onClick={() => navigate(`/studentProfile/${user.id}`)}
                            className={navLinkClass(`/studentProfile/${user.id}`)}
                        >
                            <UserCircle size={16} />
                            Profile
                        </span>
                    )}

                    <Notification UserId={user.id} />

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 text-sm font-medium text-indigo-100 hover:text-white transition-colors"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </nav>
            ) : null}
        </header>
    )
}
export default Header