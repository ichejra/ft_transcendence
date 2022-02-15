import { NextPage } from "next";
import React, { useState } from "react";
import { Login, SignUp } from "../../components/auth";

const Authentication: NextPage = () => {
  const [loginForm, setLoginForm] = useState(false);

  return (
    <div className="screen-bg- page-100 bg-black flex justify-center items-center">
      {loginForm ? (
        <Login setLoginForm={setLoginForm} />
      ) : (
        <SignUp setLoginForm={setLoginForm} />
      )}
    </div>
  );
};

export default Authentication;
