import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
import "./EnterClassroom.css";
import { useUser } from "../../context/UserContext";

export default function EnterClassroom() {
  const { setClassId } = useUser();
  const [className, setClassName] = useState("");
  const [password, setPassword] = useState("");
  const [allClassrooms, setAllClassrooms] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch all classrooms on mount
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/classrooms/getall`, {
          method: "GET",
          credentials: "include", // ✅ for sending cookies
        });
        const data = await res.json();
        setAllClassrooms(data.classrooms || []);
      } catch (err) {
        console.error("Failed to load classrooms:", err);
        setError("Failed to load classrooms.");
      }
    };
    fetchClassrooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Find classroom object by name
    const match = allClassrooms.find((cls) => cls.name === className);
    if (!match) {
      setError("Classroom not found.");
      return;
    }

    try {
      // Verify password via API
      const res = await fetch(
        `${BASE_URL}/api/classrooms/verify-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // ✅ added here also
          body: JSON.stringify({ id: match._id, password }),
        }
      );

      const result = await res.json();

      if (result.success) {
        setClassId(match._id); // ✅ Set class ID from matched classroom
        navigate(`/classroom/${className}`);
      } else {
        setError("Incorrect password.");
      }
    } catch (err) {
      console.error("Error verifying password:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="enter-classroom-container">
      <h2>Enter Classroom 🏫</h2>
      <form onSubmit={handleSubmit} className="enter-form">
        <div className="dropdown-container">
          <input
            list="classroom-names"
            placeholder="Select Classroom"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />
          <datalist id="classroom-names">
            {allClassrooms.map((cls) => (
              <option key={cls._id} value={cls.name} />
            ))}
          </datalist>
        </div>

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error-msg">{error}</p>}

        <button type="submit">Enter Classroom</button>
      </form>
    </div>
  );
}
