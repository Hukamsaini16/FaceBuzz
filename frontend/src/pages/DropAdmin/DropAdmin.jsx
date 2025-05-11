

import React, { useEffect, useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import "./DropAdmin.css";
import { useUser } from "../../context/UserContext";

const DropAdmin = () => {
  const { loginAdminId } = useUser(); 
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/admins/admins`,
          { withCredentials: true } // 👈 Send cookies
        );

        const filtered = response.data.admins.filter(
          (admin) => String(admin.adminId) !== String(loginAdminId)
        );

        setAdmins(filtered);
      } catch (error) {
        console.error("Failed to fetch admins", error);
      }
    };

    fetchAdmins();
  }, [loginAdminId]);

  const handleDelete = async (adminMongoId) => {
    if (!window.confirm("Are you sure you want to remove this admin?")) return;
    try {
      await axios.delete(
        `${BASE_URL}/api/admins/admins/${adminMongoId}`,
        { withCredentials: true } // 👈 Send cookies on DELETE also
      );
      setAdmins((prev) => prev.filter((admin) => admin._id !== adminMongoId));
    } catch (error) {
      console.error("Error deleting admin", error);
    }
  };

  return (
    <div className="drop-admin-container">
      <h2 className="drop-admin-title">Admins</h2>
      {admins.length === 0 ? (
        <p className="drop-admin-empty">No other admins available.</p>
      ) : (
        <ul className="admin-list">
          {admins.map((admin) => (
            <li key={admin._id} className="admin-item">
              <span className="admin-name">
                {admin.name} <span className="admin-id">({admin.adminId})</span>
              </span>
              <button
                className="delete-btn"
                onClick={() => handleDelete(admin._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropAdmin;

