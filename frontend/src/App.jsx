
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import StudentRegister from "./pages/StudentRegister/StudentRegister";
import Attendance from "./pages/Attendance/Attendance";
import TeacherDashboard from "./pages/TeacherDashboard/TeacherDashboard";
import CreateClassroom from "./components/CreateClassroom/CreateClassroom";
import ClassroomDashboard from "./pages/ClassroomDashboard/ClassroomDashboard";
import EnterClassroom from "./components/EnterClassroom/EnterClassroom";
import AttendanceRecord from "./pages/AttendanceRecord/AttendanceRecord";
import RemoveStudent from "./pages/RemoveStudent/RemoveStudent";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import TodayAttendance from "./pages/TodayAttendance/TodayAttendance";
import TeacherPanel from "./pages/TeacherPanel/TeacherPanel";
import DropTeacher from "./pages/DropTeacher/DropTeacher";
import TeacherRecord from "./pages/TeacherRecord/TeacherRecord";
import Admin from "./pages/Admin/Admin";
import DropAdmin from "./pages/DropAdmin/DropAdmin";
import ClassroomPage from "./pages/ClassroomPage/ClassroomPage";
import AddAdmin from "./pages/AddAdmin/AddAdmin";
import TeacherRegister from "./pages/TeacherRegistration/TeacherRegistration";
import TeacherAttendance from "./pages/TeacherAttendance/TeacherAttendance";
import RoleSelection from "./components/RoleSelector/RoleSelector";
import FaceLogin from "./components/FaceLogin/FaceLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import NotFound from "./pages/NotFound/NotFound";
import AdminHolidays from "./components/AdminHolidays/AdminHolidays";
//import "./App.css"

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/main" element={<Home />} />
        <Route element={<PublicRoute />}>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/face-login" element={<FaceLogin />} />
        </Route>


        <Route element={<ProtectedRoute />}>
        <Route path="/teacher/create-classroom" element={<CreateClassroom />} />
        <Route path="/teacher/join-classroom" element={<EnterClassroom />} />


        <Route path="/classroom/:classname/register-student" element={<StudentRegister />} />
        <Route path="/classroom/:classname/take-attendance" element={<Attendance />} />
        <Route path="/classroom/:classname" element={<ClassroomDashboard />} />
        <Route path="/classroom/:classname/attendance-record" element={<AttendanceRecord />} />
        <Route path="/classroom/:classname/remove-student" element={<RemoveStudent />} />
        
        
        <Route path="/admin/teacher" element={<TeacherPanel />} />
        <Route path="/admin/register-teacher" element={<TeacherRegister />} />
        <Route path="/admin/teacher-attendance" element={<TeacherAttendance />} />
        <Route path="/admin/attendance" element={<TodayAttendance />} />
        <Route path="/admin/drop-teacher" element={<DropTeacher />} />
        <Route path="/admin/teacher-record" element={<TeacherRecord />} />
        <Route path="/admin/manage" element={<Admin />} />
        <Route path="/admin/add" element={<AddAdmin />} />
        <Route path="/admin/drop" element={<DropAdmin />} />
        <Route path="/admin/classroom" element={<ClassroomPage />} />
        <Route path="/admin/holidays" element={<AdminHolidays />} />

        
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Catch all unmatched routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;







