import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
const NotLoggedInOnly = ({ children }) => {
  const isLogin = useSelector((state) => state.user.isLogin);
  if (isLogin) {
    return <Navigate to="/account/profile" replace={true} />;
  }

  return <>{children}</>;
};

export default NotLoggedInOnly;
