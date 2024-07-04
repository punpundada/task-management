import { useAuthContext } from "@/context/AuthContext";
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? children : <Navigate to="/auth/login" />;
};

export default ProtectedRoute;
