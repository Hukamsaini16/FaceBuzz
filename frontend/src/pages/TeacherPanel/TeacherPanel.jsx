import React from "react";
import { useNavigate } from "react-router-dom";
import "./TeacherPanel.css";

const TeacherPanel = () => {
  const navigate = useNavigate();

  return (
    <div className="teacher-panel-container">
      <h2 className="teacher-title">👩‍🏫 Teacher Management</h2>
      <div className="teacher-buttons">
        <button onClick={() => navigate("/admin/register-teacher")}>
          📝 Register Teacher
        </button>
        <button onClick={() => navigate("/admin/teacher-attendance")}>
          📊 Attendance
        </button>
        <button onClick={() => navigate("/admin/drop-teacher")}>
           Teachers
        </button>
      </div>
    </div>
  );
};

export default TeacherPanel;
