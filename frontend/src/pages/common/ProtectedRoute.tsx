import { useAuthContext } from "@/context/AuthContext";
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthContext();
  const user = localStorage.getItem("user")
  return isAuthenticated && user ? children : <Navigate to="/auth/login" />;
};

export default ProtectedRoute;
