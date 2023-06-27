import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
const LoggedInOnly = ({ children }) => {
  const userInfo = useSelector((state) => state.user.userInfo);
  if (!userInfo) {
    return <Navigate to="/login-register" />;
  }
  return <>{children}</>;
};

export default LoggedInOnly;
