import { useNavigate } from "react-router-dom";
import "./TeacherDashboard.css";

export default function TeacherDashboard() {
  const navigate = useNavigate();

  return (
    <div className="teacher-dashboard">
      <h1 className="dashboard-heading">Welcome, Teacher 👩‍🏫</h1>
      <div className="button-group">
        <button
          className="dashboard-btn"
          onClick={() => navigate("/teacher/create-classroom")}
        >
          📘 Create Classroom
        </button>
        <button
          className="dashboard-btn"
          onClick={() => navigate("/teacher/join-classroom")}
        >
          🔑 Enter Classroom
        </button>
      </div>
    </div>
  );
}
