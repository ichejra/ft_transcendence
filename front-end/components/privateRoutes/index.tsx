import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { useAppSelector } from "../../app/hooks";
import CompleteUserProfileInfo from "../auth/CompleteUserProfileInfo";

export const AuthRoute: React.FC = ({ children }) => {
  const location = useLocation();
  const { isLoggedIn } = useAppSelector((state) => state.loginStatus);

  if (!isLoggedIn && location.pathname !== "/login") {
    return <Navigate to="/auth" state={{ from: location }} replace={true} />;
  }
  return <>{children}</>;
};

export const CompleteProfile: React.FC = ({ children }) => {
  const { isLoggedIn, username } = useAppSelector((state) => state.loginStatus);

  if (isLoggedIn && !username) {
    return <Navigate to="/complete-info" replace={true} />;
  }
  return <>{children}</>;
};

export const AdminRoute: React.FC = ({ children }) => {
  const location = useLocation();
  const { isLoggedIn, isAdmin } = useAppSelector((state) => state.loginStatus);

  if (!isAdmin && isLoggedIn && location.pathname === "/dashboard") {
    return <Navigate to="/" state={{ from: location }} />;
  }
  return <>{children}</>;
};
