import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const buttons = [
    { label: "Today Attendance", path: "/admin/attendance" },
    { label: "Teacher", path: "/admin/teacher" },
    { label: "Teacher Record", path: "/admin/teacher-record" },
    { label: "Admin", path: "/admin/manage" },
    { label: "Classrooms", path: "/admin/classroom" },
    { label: "Holidays", path: "/admin/holidays" }, 
  ];

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-buttons">
        {buttons.map((btn, idx) => (
          <button key={idx} onClick={() => navigate(btn.path)} className="dashboard-btn">
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
