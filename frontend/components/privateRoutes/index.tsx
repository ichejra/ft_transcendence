import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logOutUser } from "../../features/userProfileSlice";

export const AuthRoute: React.FC = ({ children }) => {
  const location = useLocation();
  const { isLoggedIn, isVerified, loggedUser } = useAppSelector(
    (state) => state.user
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (loggedUser.is_2fa_enabled && !isVerified) {
      dispatch(logOutUser());
    }
  }, []);

  if (!isLoggedIn && location.pathname !== "/auth") {
    return <Navigate to="/auth" state={{ from: location }} replace={true} />;
  }
  return <>{children}</>;
};

export const CompleteProfile: React.FC = ({ children }) => {
  const {
    loggedUser: { user_name },
  } = useAppSelector((state) => state.user);

  if (!user_name) {
    return <Navigate to="/complete-info" replace={true} />;
  }
  return <>{children}</>;
};
