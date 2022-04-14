import { verify2FACode } from "../../features/userProfileSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router";

const VerificationPage = () => {
  const dispatch = useAppDispatch();
  const [toHome, setToHome] = useState(false);
  const [isValid, setIsValid] = useState(0);
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const divRef = useRef(null);

  const handleUserVerification = (e: any) => {
    e.preventDefault();
    dispatch(verify2FACode(code)).then((data: any) => {
      if (data.error) {
        setIsValid(1);
      } else {
        setIsValid(0);
        navigate("/", { replace: true });
      }
    });
    setCode("");
  };

  const codeValueChange = (e: any) => {
    const value = e.target.value;
    // const checkType = /^\d+$/.test(value);
    // console.log("code => ", checkType);
    if (value.length > 6 || (value && !Number(value))) return;
    setCode(value);
  };

  useEffect(() => {
    const codeRegex = /^[0-9]{6}$/;
    setIsValid(() => {
      if (!code) {
        return 0;
      }
      return !codeRegex.test(code) ? 2 : 0;
    });
  }, [code]);

  if (toHome) {
    return <Navigate to="/" replace={true} />;
  }
  return (
    <div
      onClick={(e) => {
        if (e.target == divRef.current) {
          console.log("go home");
          setToHome(true);
        }
      }}
      className="page-100 fixed z-50 bg-black bg-opacity-75 w-full h-full top-0 left-0"
    >
      <div ref={divRef} className="flex justify-center items-center h-full">
        <div className="flex flex-col items-center justify-center w-full md:w-[35rem] 2xl:w-[40rem] h-full md:h-[20rem] py-12 user-card-bg border border-gray-700 text-gray-300 about-family">
          <h1 className="font-bold about-title-family text-2xl mb-8 tracking-wider">
            Verify
          </h1>
          <form className="flex flex-col w-5/6 md:w-4/6 text-gray-800">
            <input
              type="text"
              placeholder="XXX XXX"
              value={code}
              onChange={codeValueChange}
              className="flex items-center justify-center transition duration-300 border-2 text-gray-600  bg-gray-300 hover:bg-white rounded-md  m-2 p-2 tracking-wider"
            />
            {isValid === 1 ? (
              <p className="text-red-400 text-sm font-sans font-bold px-2">
                Invalid Code
              </p>
            ) : isValid === 2 ? (
              <p className="text-red-400 text-sm font-sans font-bold px-2">
                6 numbers required
              </p>
            ) : (
              <span></span>
            )}

            <button
              type="submit"
              onClick={handleUserVerification}
              className="flex items-center justify-center about-family transition duration-300 border-2 text-gray-900  bg-gray-300 hover:bg-white rounded-md  m-2 p-2 tracking-wider"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
