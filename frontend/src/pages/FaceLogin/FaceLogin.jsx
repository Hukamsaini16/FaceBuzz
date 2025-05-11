import { useParams, useNavigate } from "react-router-dom";
import FaceLogin from "../../components/FaceLogin/FaceLogin";


export default function LoginPage() {
  const { role } = useParams(); // teacher or admin
  const navigate = useNavigate();

  const handleSuccess = (userInfo) => {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    navigate(role === "admin" ? "/admin" : "/teacher");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-xl font-semibold mb-4">Login as {role}</h1>
      <FaceLogin role={role} onSuccess={handleSuccess} />
    </div>
  );
}


