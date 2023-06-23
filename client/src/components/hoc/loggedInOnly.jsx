import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
const LoggedInOnly = ({ children }) => {
  const isLogin = useSelector((state) => state.user.isLogin);
  if (!isLogin) {
    return <Navigate to="/login-register" replace={true} />;
  }

  return <>{children}</>;
};

export default LoggedInOnly;
