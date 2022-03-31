import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAppSelector } from "../../app/hooks";

export const AuthRoute: React.FC = ({ children }) => {
  const location = useLocation();
  const { isLoggedIn } = useAppSelector((state) => state.user);

  if (!isLoggedIn && location.pathname !== "/auth") {
    return <Navigate to="/auth" state={{ from: location }} replace={true} />;
  }
  return <>{children}</>;
};

export const CompleteProfile: React.FC = ({ children }) => {
  const {
    user: { user_name },
  } = useAppSelector((state) => state.user);

  if (!user_name) {
    return <Navigate to="/complete-info" replace={true} />;
  }
  return <>{children}</>;
};
