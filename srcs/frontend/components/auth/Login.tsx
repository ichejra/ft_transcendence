import {
  fetchCurrentUser,
  fetchAllUsers,
} from "../../features/userProfileSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";

const Login = () => {
  const dispatch = useAppDispatch();
  const { completeInfo } = useAppSelector((state) => state.user);
  const divRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (Cookies.get("accessToken") && completeInfo) {
      dispatch(fetchCurrentUser());
      dispatch(fetchAllUsers());
    }
  }, []);

  return (
    <div
      onClick={(e) => {
        if (e.target == divRef.current) {
          navigate("/", { replace: true });
        }
      }}
      className="page-100 fixed z-50 bg-black bg-opacity-75 w-full h-full top-0 left-0"
    >
      <div ref={divRef} className="flex justify-center items-center h-full">
        <div className="flex flex-col items-center justify-center w-full md:w-[35rem] 2xl:w-[40rem] h-full md:h-[20rem] py-12 user-card-bg border border-gray-700 text-gray-300 about-family">
          <h1 className="font-bold about-title-family text-3xl mb-8 tracking-wider">
            Login
          </h1>
          <div className="flex flex-col w-5/6 md:w-4/6 text-gray-800">
            <a
              href="http://192.168.99.117:3001/auth"
              className="flex items-center justify-center about-family transition duration-300 border-2 text-gray-900  bg-gray-300 hover:bg-white rounded-md  m-2 p-2 tracking-wider"
            >
              <img
                src="/images/42_logo_white.svg"
                alt="42 logo"
                className="w-8 h-8 mr-4 pr-1"
              />
              <p className="font-bold">Login with Intra</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
