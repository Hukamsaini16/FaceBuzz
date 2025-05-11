

import React, { useState, useEffect } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import "./ClassroomPage.css";

const ClassroomPage = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch classrooms data
  const fetchClassrooms = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/classrooms`, {
        withCredentials: true, // 👈 Send cookies on DELETE also
      });
      console.log("Fetched classroom data:", response.data); // log the structure of response
      setClassrooms(response.data); // assuming teacher data is already populated in the response
      setLoading(false);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      setLoading(false);
    }
  };

  // Fetch classrooms on component mount
  useEffect(() => {
    fetchClassrooms();
  }, []);

  const handleDeleteClassroom = async (classroomId) => {
    if (!window.confirm("Are you sure you want to remove this classroom?")) return;
    try {
      await axios.delete(
        `${BASE_URL}/api/classrooms/${classroomId}`,
        { withCredentials: true } // 👈 Send cookies on DELETE also
      );
      setClassrooms(classrooms.filter((classroom) => classroom._id !== classroomId)); // Using _id instead of id
    } catch (error) {
      console.error("Error deleting classroom:", error);
    }
  };

  return (
    <div className="classroom-page">
      <h1>Classrooms</h1>

      {loading ? (
        <p>Loading classrooms...</p>
      ) : (
        <div className="classroom-list">
          {classrooms.length > 0 ? (
            classrooms.map((classroom) => (
              <div key={classroom._id} className="classroom-item">
                <div className="classroom-info">
                  <div className="classroom-name">
                    <strong>Classroom Name:</strong> {classroom.name}
                  </div>
                  <div className="teacher-name">
                    <strong>Created By:</strong>{" "}
                    {classroom.createdBy?.name || "No Teacher"}
                  </div>
                  <div className="student-count">
                    <strong>Total Students:</strong> {classroom.totalStudents ?? 0}
                  </div>
                  <div className="classroom-password">
                    <strong>Password:</strong> {classroom.password}
                  </div>
                </div>
                <div className="action">
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteClassroom(classroom._id)} // Using _id for deletion
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No classrooms available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassroomPage;

