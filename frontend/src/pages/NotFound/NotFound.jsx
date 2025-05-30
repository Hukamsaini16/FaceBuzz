
import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404 - Page Not Found 🚫</h1>
      <p className="not-found-message">The page you're looking for doesn't exist.</p>
      <Link to="/" className="not-found-link">Go Home</Link>
    </div>
  );
};

export default NotFound;

