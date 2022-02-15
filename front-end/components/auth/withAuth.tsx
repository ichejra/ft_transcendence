import { GetServerSideProps, NextComponentType } from "next";
import { useRouter } from "next/router";
import { useAppSelector } from "../../app/hooks";
import Login from "./Login";
import UserProfileInfo from "./CompleteUserProfileInfo";

const withAuth = (ProtectedComp: NextComponentType) => {
  const Auth = () => {
    const Router = useRouter();
    const { isLoggedIn } = useAppSelector((state) => state.loginStatus);

    console.log(isLoggedIn);

    if (!isLoggedIn) {
      Router.push("/auth");
      return <Login />;
    }
    return <ProtectedComp />;
  };

  return Auth;
};

export default withAuth;
