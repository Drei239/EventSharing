import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
const LoggedInOnly = ({ children }) => {
  const { isLogin, isLoading } = useSelector((state) => state.user);
  if (!isLogin & !isLoading) {
    return <Navigate to="/login-register" replace={true} />;
  }
  return <>{children}</>;
};

export default LoggedInOnly;
