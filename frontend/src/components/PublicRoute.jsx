import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

const PublicRoute = () => {
  const { loginTeacherId, loginAdminId } = useUser();

  if (loginTeacherId) {
    return <Navigate to="/teacher/dashboard" />;
  }

  if (loginAdminId) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <Outlet />;
};

export default PublicRoute;
