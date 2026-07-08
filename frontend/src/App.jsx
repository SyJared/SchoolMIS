import Classroom from "./classroom/classroom";
import ClassroomDetails from "./classroom/classroomDetails";
import "./index.css";
import Login from "./login-register/login";
import Register from "./login-register/register";
import Student from "./student/student.jsx"
import Header from "./header/header.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/authContext";
import StudentPage from "./studentPage/studentPage";
function App() {
    const { user } = useAuth();

  return (
      <>
          <BrowserRouter>
              <Header />
              <Routes>
                  <Route path="/students" element={<Student />} />
                  <Route path="/" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/classroom" element={<Classroom />} />
                  <Route path="/classroom/:ClassroomId" element={<ClassroomDetails />} />
                  {user?.role === "Student" && (
                      <Route path="/studentPage" element={<StudentPage />} />
                  ) }
              </Routes>
          </BrowserRouter>
    </>
  ) 
}

export default App
