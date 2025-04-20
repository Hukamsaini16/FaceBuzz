import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <img src="/facelogo.png" alt="Face Recognition Logo" className="logo" />
      <h1 className="headline">Face Recognition Attendance</h1>
      <div className="link-buttons">
        <Link to="/register" className="home-link">
          Student Registration
        </Link>
        <Link to="/attendance" className="home-link">
          Attendance
        </Link>
      </div>
    </div>
  );
};

export default Home;
