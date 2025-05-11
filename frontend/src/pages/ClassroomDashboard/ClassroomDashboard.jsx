import { useParams, useNavigate } from "react-router-dom";
import "./ClassroomDashboard.css";

export default function ClassroomDashboard() {
  const { classname } = useParams(); // URL param
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(`/classroom/${classname}/${path}`);
  };

  return (
    <div className="classroom-dashboard-container">
      <h2>Welcome to {classname} 🎓</h2>
      <div className="button-grid">
        <button onClick={() => handleNavigate("take-attendance")}>
          🧑‍🏫 Take Attendance
        </button>
        <button onClick={() => handleNavigate("register-student")}>
          📝 Register Student
        </button>
        <button onClick={() => handleNavigate("attendance-record")}>
          📊 Attendance Record
        </button>
        <button onClick={() => handleNavigate("remove-student")}>
           Students
        </button>
      </div>
    </div>
  );
}
