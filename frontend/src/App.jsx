import Classroom from "./classroom/classroom";
import ClassroomDetails from "./classroom/classroomDetails";
import "./index.css";
import Login from "./login-register/login";
import Register from "./login-register/register";
import Student from "./student/student.jsx"
import Header from "./header/header.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/authContext";
import StudentPage from "./studentPage/studentPage";
import StudentProfile from "./student/studentProfile";
import TeacherDashboard from "./dashboards/teacherDashboard";
import StudentDashboard from "./dashboards/studentDashboard";
import StudentClassroomDetails from "./studentPage/studentClassroomDetails";
import QuizAttempts from "./quiz/QuizAttempts";
import QuizDetails from "./quiz/QuizDetails";
import TakeQuiz from "./studentPage/quiz/takeQuiz";
import QuizResult from "./studentPage/quiz/quizResult";
import AdminDashboard from "./admin/adminDashboard";
import TeacherClassroom from "./classroom/teacherClassroom";
import TeacherStudents from "./student/teacherStudent";

// Wrapper that only renders children if user.role is in allowedRoles
function ProtectedRoute({ allowedRoles, children }) {
    const { user } = useAuth();

    if (!user) return <Navigate to="/" replace />;
    if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

    return children;
}

function App() {
    const { user } = useAuth();

    return (
        <>
            <BrowserRouter>
                <Header />
                <Routes>
                    {/* Public */}
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Admin + Teacher shared */}
                    <Route
                        path="/classroom"
                        element={
                            <ProtectedRoute allowedRoles={["Admin"]}>
                                <Classroom />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/teacherClassroom"
                        element={
                            <ProtectedRoute allowedRoles={["Teacher"]}>
                                <TeacherClassroom />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/classroom/:ClassroomId"
                        element={
                            <ProtectedRoute allowedRoles={["Admin", "Teacher"]}>
                                <ClassroomDetails />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/students"
                        element={
                            <ProtectedRoute allowedRoles={["Admin"]}>
                                <Student />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/teacherStudents"
                        element={
                            <ProtectedRoute allowedRoles={["Teacher"]}>
                                <TeacherStudents />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/quiz/:quizId"
                        element={
                            <ProtectedRoute allowedRoles={["Admin", "Teacher"]}>
                                <QuizDetails />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/quiz/:quizId/attempts"
                        element={
                            <ProtectedRoute allowedRoles={["Admin", "Teacher"]}>
                                <QuizAttempts />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin only */}
                    <Route
                        path="/adminDashboard"
                        element={
                            <ProtectedRoute allowedRoles={["Admin"]}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Teacher only */}
                    <Route
                        path="/teacherDashboard"
                        element={
                            <ProtectedRoute allowedRoles={["Teacher"]}>
                                <TeacherDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Student only */}
                    <Route
                        path="/studentDashboard"
                        element={
                            <ProtectedRoute allowedRoles={["Student"]}>
                                <StudentDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/studentClassroom"
                        element={
                            <ProtectedRoute allowedRoles={["Student"]}>
                                <StudentPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/studentProfile/:studentId"
                        element={
                            <ProtectedRoute allowedRoles={["Student"]}>
                                <StudentProfile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/studentClassroomDetails/:classroomId"
                        element={
                            <ProtectedRoute allowedRoles={["Student"]}>
                                <StudentClassroomDetails />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/quiz/:quizId/take"
                        element={
                            <ProtectedRoute allowedRoles={["Student"]}>
                                <TakeQuiz />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/quiz/attempt/:attemptId/result"
                        element={
                            <ProtectedRoute allowedRoles={["Student"]}>
                                <QuizResult />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App