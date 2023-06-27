import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
const NotLoggedInOnly = ({ children }) => {
  const userInfo = useSelector((state) => state.user.userInfo);
  if (userInfo) {
    return <Navigate to="/account/profile" />;
  }

  return <>{children}</>;
};

export default NotLoggedInOnly;
