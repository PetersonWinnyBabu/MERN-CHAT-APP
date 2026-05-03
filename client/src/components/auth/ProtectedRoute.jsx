import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children, logged, redirect = "/login" }) => {
  if (!logged) {
    return <Navigate to={redirect} />;
  } else {
    return children ? children : <Outlet />;
  }
};

export default ProtectedRoute;
