import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAppSelector } from "../../app/hooks";
import SocketProvider from "../../pages/SocketProvider";

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
    user: { user_name: username },
  } = useAppSelector((state) => state.user);

  if (!username) {
    return <Navigate to="/complete-info" replace={true} />;
  }
  return <SocketProvider>{children}</SocketProvider>;
};
