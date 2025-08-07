import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
const PrivateRoute = ({ children }) => {
  const { user } = useAuth(); // Assuming user holds the authentication state

  if (!user) {
    // If there is no user, redirect to login page
    return <Navigate to="/login" />;
  }

  return children; // Otherwise, render the protected component
};

export { PrivateRoute }; // Ensure it is exported correctly