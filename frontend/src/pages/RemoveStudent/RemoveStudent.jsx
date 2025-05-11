import { useEffect, useState } from "react";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import "./RemoveStudent.css";
import { useUser } from "../../context/UserContext";

export default function RemoveStudent() {
  const { classId } = useUser();
  const [students, setStudents] = useState([]);
  const [classroomName, setClassroomName] = useState("");

  useEffect(() => {
    if (classId) {
      fetchStudents();
      fetchClassroomName();
    }
  }, [classId]);

  const fetchStudents = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/students/class/${classId}`,
        {
          credentials: "include", // ✅ Correct way for fetch()
        }
      );
      const data = await res.json();
      if (data.success) {
        const sorted = data.students.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setStudents(sorted);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const fetchClassroomName = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/classrooms/classrooms/${classId}`,
        {
          credentials: "include", // ✅ Add here too
        }
      );
      const data = await res.json();
      if (data.success) {
        setClassroomName(data.classroom.name);
      }
    } catch (err) {
      console.error("Error fetching classroom name:", err);
    }
  };

  const handleDelete = async (studentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this student?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${BASE_URL}/api/students/students/${studentId}?classId=${classId}`,
        {
          method: "DELETE",
          credentials: "include", // ✅ Also when deleting
        }
      );
      const data = await res.json();

      if (data.success) {
        setStudents((prev) => prev.filter((s) => s._id !== studentId));
      } else {
        alert(data.message || "Failed to remove student");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="remove-student-container">
      <h2> "{classroomName || "Classroom"}" Classroom</h2>

      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <ul className="student-list">
          {students.map((student) => (
            <li key={student._id} className="student-item">
              <div className="student-info">
                <span className="student-name">{student.name}</span>
                <span className="student-enrollment">
                  {student.enrollNumber}
                </span>
              </div>
              <button
                className="delete-button"
                onClick={() => handleDelete(student._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
