// src/pages/Admin/Admin.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Panel</h2>
      <div className="admin-buttons">
        <button className="admin-btn" onClick={() => navigate("/admin/add")}>
          Add Admin
        </button>
        <button className="admin-btn" onClick={() => navigate("/admin/drop")}>
           Admins
        </button>
      </div>
    </div>
  );
};

export default Admin;
