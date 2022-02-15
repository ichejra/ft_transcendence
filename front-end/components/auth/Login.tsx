import { setLoggedIn } from "../../features/isLoggedInTestSlice";
import { useAppDispatch } from "../../app/hooks";

const Login = () => {
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    console.log("Logged");
    dispatch(setLoggedIn({ isLoggedIn: true, isAdmin: false }));
  };
  return (
    <div className="page-100 absolute bg-gray-800 w-full h-full top-0 left-0 flex justify-center items-center">
      <div className="flex flex-col items-center justify-center w-full md:w-3/6 h-full md:h-1/4 py-12 bg-gray-200 text-gray-800 rounded-xl shadow-xl">
        <h1 className="font-bold font-mono text-3xl mb-8 tracking-wider">
          Login
        </h1>
        <div className="flex flex-col w-5/6 md:w-3/6 text-gray-800">
          <button
            onClick={handleLogin}
            className="flex items-center justify-center bg-white p-4 rounded-md m-2 shadow-md hover:bg-gray-300 transition duration-300"
          >
            <img
              src="/images/42_logo_white.svg"
              className="w-8 h-8 mr-4 pr-1"
            />
            <p className="font-bold">Login with Intra</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
