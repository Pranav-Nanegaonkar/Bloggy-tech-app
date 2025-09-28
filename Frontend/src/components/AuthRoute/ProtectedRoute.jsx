import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { userAuth } = useSelector((state) => state.users);
  const isLoggedIn = userAuth?.userInfo?.token;
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
