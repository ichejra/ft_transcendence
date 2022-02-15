import { FcGoogle } from "react-icons/fc";

interface Props {
  setLoginForm: (a: boolean) => void;
}

const Login: React.FC<Props> = ({ setLoginForm }) => {
  const handleLoginForm = (e: React.FormEvent<EventTarget>): void => {
    e.preventDefault();
    console.log(e.target);
  };
  return (
    <div className="flex flex-col items-center justify-center w-full h-full py-12 bg-gray-800 text-gray-200 rounded-xl shadow-xl">
      <h1 className="font-bold font-mono text-3xl mb-8 tracking-wider">
        Login
      </h1>

      <form className="flex flex-col justify-center w-5/6 md:w-2/6">
        <input
          type="text"
          id="username"
          name="username"
          placeholder="username"
          className="p-4 rounded-md m-2 tracking-wider"
          autoComplete="username"
        />
        <input
          type="password"
          id="pass"
          name="pass"
          placeholder="password"
          className="p-4 rounded-md m-2 tracking-wider"
          autoComplete="new-password"
        />
        <button
          type="submit"
          onClick={handleLoginForm}
          className={`rounded-md bg-yellow-400 text-gray-800 m-2 p-3 font-bold font-mono tracking-wider ${
            0 && "opacity-50"
          }`}
          disabled
        >
          Login
        </button>
      </form>
      <p className="text-gray-300 mb-2">_____________ Or _____________</p>

      <div className="flex flex-col w-5/6 md:w-2/6 text-gray-800">
        <button className="flex items-center justify-center bg-white p-2 rounded-md m-2 hover:bg-gray-300 transition dura">
          <FcGoogle className="w-8 h-8 mr-4" />
          <p className="font-bold">Log in with Google</p>
        </button>
        <button className="flex items-center justify-center bg-white p-2 rounded-md m-2 hover:bg-gray-300 transition dura">
          <img src="/images/42_logo_white.svg" className="w-8 h-8 mr-4 pr-1" />
          <p className="font-bold">Log in with Intra</p>
        </button>
      </div>
      <p className="text-lg my-2 font-mono">
        Dont't have an account?
        <button
          className="font-bold ml-2 text-yellow-500 tracking-wider underline decoration-yellow-500 underline-offset-1"
          onClick={() => setLoginForm(false)}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;
