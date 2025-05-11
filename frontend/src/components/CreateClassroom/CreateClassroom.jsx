import { useState } from "react";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import { useUser } from "../../context/UserContext";
import "./CreateClassroom.css";

export default function CreateClassroom() {
  const { loginTeacherId, setClassId } = useUser();
  const navigate = useNavigate();
  console.log(loginTeacherId);

  const [form, setForm] = useState({
    name: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.password) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/classrooms/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ added here
        body: JSON.stringify({
          ...form,
          teacherId: loginTeacherId,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setClassId(data.classroom._id); // ✅ Set classId in context
        setMessage("Classroom created successfully!");
        setTimeout(() => {
          navigate(`/classroom/${data.classroom.name}`);
        }, 1000);
      } else {
        setMessage(data.message || "Failed to create classroom.");
      }
    } catch (err) {
      console.error("Error creating classroom:", err);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="create-classroom-container">
      <h2>Create a New Classroom</h2>
      <form onSubmit={handleSubmit} className="create-classroom-form">
        <input
          type="text"
          name="name"
          placeholder="Classroom Name"
          value={form.name}
          onChange={handleChange}
          autoComplete="off" // ⛔ disable suggestions
        />
        <input
          type="password"
          name="password"
          placeholder="Classroom Password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password" // more secure for passwords
        />

        <button type="submit">Create Classroom</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}
