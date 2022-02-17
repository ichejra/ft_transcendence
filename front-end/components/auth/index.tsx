import React from "react";
import { useAppSelector } from "../../app/hooks";
import Login from "./Login";
// import { Navigate } from "react-router-dom";

const Authentication: React.FC = () => {
  const { isLoggedIn } = useAppSelector((state) => state.loginStatus);

  // if (isLoggedIn) {
  //   <Navigate to="/" />;
  // }
  return <Login />;
};

export default Authentication;
