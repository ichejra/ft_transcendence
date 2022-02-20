import { fetchCurrentUser } from "../../features/userProfileSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface StateType {
  from: { pathname: string };
}

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as StateType;
  let from = state?.from?.pathname || "/";
  const { user, isLoading } = useAppSelector((state) => state.user);

  // const handleLogin = () => {
  //   console.log("Logged");
  //   dispatch(setLoggedIn({ isLoggedIn: true }));
  //   if (!username) {
  //     navigate("/complete-info");
  //   } else {
  //     navigate(from, { replace: true });
  //   }
  // };

  useEffect(() => {
    if (Cookies.get("jwt")) {
      dispatch(fetchCurrentUser());
    }
  }, [location]);

  return (
    <div className="page-100 absolute bg-gray-800 w-full h-full top-0 left-0 flex justify-center items-center">
      <div className="flex flex-col items-center justify-center w-full md:w-3/6 2xl:w-1/5 h-full md:h-1/4 py-12 bg-gray-200 text-gray-800 sm:rounded-xl shadow-xl">
        <h1 className="font-bold font-mono text-3xl mb-8 tracking-wider">
          Login
        </h1>
        <div className="flex flex-col w-5/6 md:w-4/6 text-gray-800">
          <a
            href="http://localhost:3000/auth"
            className="flex items-center justify-center bg-white p-4 rounded-md m-2 shadow-md hover:bg-gray-300 transition duration-300"
          >
            <img
              src="/images/42_logo_white.svg"
              className="w-8 h-8 mr-4 pr-1"
            />
            <p className="font-bold">Login with Intra</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
