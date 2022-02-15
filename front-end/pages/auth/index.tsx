import { NextPage } from "next";
import React from "react";
import CompleteUserProfileInfo from "../../components/auth/CompleteUserProfileInfo";
import { useAppSelector } from "../../app/hooks";
import Login from "../../components/auth/Login";

const Authentication: NextPage = () => {
  const { isLoggedIn } = useAppSelector((state) => state.loginStatus);

  console.log(isLoggedIn);
  if (!isLoggedIn) {
    return <Login />;
  }
  return <CompleteUserProfileInfo />;
};

export default Authentication;
