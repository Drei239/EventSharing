import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
const NotLoggedInOnly = ({ children }) => {
  const { isLogin, isLoading } = useSelector((state) => state.user);
  if (isLogin & !isLoading) {
    return <Navigate to="/account/profile" />;
  }

  return <>{children}</>;
};

export default NotLoggedInOnly;
