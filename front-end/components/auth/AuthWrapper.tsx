import { useAppSelector } from "../../app/hooks";
import Login from "./Login";
import { useRouter } from "next/router";
import { useEffect } from "react";
import CompleteUserProfileInfo from "./CompleteUserProfileInfo";

const AuthWrapper: React.FC = ({ children }) => {
  const { isLoggedIn, isAdmin } = useAppSelector((state) => state.loginStatus);
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin && router.pathname === "/dashboard") {
      router.push("/");
    }
  }, []);

  if (
    !isLoggedIn &&
    router.pathname !== "/auth" &&
    router.pathname !== "/" &&
    router.pathname !== "/about"
  ) {
    return <Login />;
  }
  if (isLoggedIn && 0) {
    return <CompleteUserProfileInfo />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
