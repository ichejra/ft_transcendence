import { useAppSelector } from "../../app/hooks";
import CompleteUserProfileInfo from "./CompleteUserProfileInfo";
import { Navigate, useLocation } from "react-router-dom";

const AuthWrapper: React.FC = ({ children }) => {
  const location = useLocation();
  const { isLoggedIn, isAdmin, username } = useAppSelector(
    (state) => state.loginStatus
  );

  if (
    !isLoggedIn &&
    location.pathname !== "/auth" &&
    location.pathname !== "/" &&
    location.pathname !== "/about"
  ) {
    return <Navigate to="/auth" />;
  }

  if (isLoggedIn && !username) {
    return <CompleteUserProfileInfo />;
  }
  if (!isAdmin && isLoggedIn && location.pathname === "/dashboard") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
