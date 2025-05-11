import React, { useEffect, useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import "./DropTeacher.css";

const DropTeacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/teachers/teachers`,
          { withCredentials: true } // 👈 Send cookies on DELETE also
        );
        const teacherList = response.data.teachers || response.data || [];

        // Sort alphabetically by name
        const sorted = teacherList.sort((a, b) => a.name.localeCompare(b.name));

        setTeachers(sorted);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this teacher?"))
      return;

    try {
      await axios.delete(`${BASE_URL}/api/teachers/teachers/${id}`,
        { withCredentials: true } // 👈 Send cookies on DELETE also
      ); // <-- fixed missing backticks
      setTeachers((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting teacher:", err);
    }
  };

  return (
    <div className="drop-teacher-container">
      <h2 className="drop-title">🧑‍🏫 Teachers</h2>
      {loading ? (
        <p>Loading teachers...</p>
      ) : teachers.length === 0 ? (
        <p>No teachers found.</p>
      ) : (
        <div className="teacher-list">
          {teachers.map((teacher) => (
            <div className="teacher-card" key={teacher._id}>
              <div className="teacher-info">
                <h4>
                  {teacher.name}{" "}
                  <span className="teacher-id">({teacher.teacherId})</span>
                </h4>
                <p>{teacher.email}</p>
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDelete(teacher._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropTeacher;
