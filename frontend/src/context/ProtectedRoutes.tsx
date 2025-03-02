import React, { useContext, ReactNode } from "react";
import { AuthContext } from "./authContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext is undefined. Make sure you are using ProtectedRoute within an AuthProvider.");
  }

  const res = authContext

  console.log("Here: ", res);

  return res.user ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
