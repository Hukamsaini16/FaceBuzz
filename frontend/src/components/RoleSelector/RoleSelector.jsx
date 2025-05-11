import { useNavigate } from "react-router-dom";
import './RoleSelector.css'

export default function RoleSelection() {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    navigate(`/face-login?role=${role}`);
  };

  return (
    <div className="role-select-container">
      <h2>Select Your Role</h2>
      <button onClick={() => handleSelect("admin")}> Admin</button>
      <button onClick={() => handleSelect("teacher")}> Teacher</button>
    </div>
  );
}
