
import React from "react";
import { useUser } from "../../context/UserContext";
import "./Navbar.css";
import logo from "../../assets/facelogo.png"; // Adjust the path if necessary

const Navbar = () => {
  const { loginTeacherId, loginAdminId, logoutTeacher, logoutAdmin } = useUser();

  const handleLogout = () => {
    if (loginTeacherId) {
      logoutTeacher();
    } else if (loginAdminId) {
      logoutAdmin();
    }
    window.location.href = "/";
  };

  return (
    <nav className="simple-navbar">
      <div className="logo">
        <img src={logo} alt="Logo" />
        FaceAttend
      </div>

      {(loginTeacherId || loginAdminId) && (
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;

