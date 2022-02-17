import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  setLoggedIn,
  completeProfileInfo,
} from "../../features/isLoggedInTestSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router";

const CompleteUserProfileInfo: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const dispatch = useAppDispatch();
  const { profileAvatar } = useAppSelector((state) => state.loginStatus);

  const handleLoginForm = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    dispatch(
      completeProfileInfo({
        profileAvatar: avatar ? avatar : profileAvatar,
        username,
      })
    );
    navigate("/");
  };

  const readURL = (e: any) => {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      const uploaded_img = reader.result as string;
      const img = document.getElementById(
        "profile-picture"
      ) as HTMLImageElement;
      img.src = `${uploaded_img}`;
      setAvatar(uploaded_img);
    });
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="page-100 flex flex-col items-center justify-center w-full h-full md:w-2/4 py-12 bg-gray-800 shadow-xl">
      <form className="flex flex-col justify-center bg-white p-8 rounded-xl w-5/6 md:w-3/4  space-y-6">
        <div className="flex justify-center">
          <label
            className="relative w-44 h-44 rounded-full hover:opacity-50 cursor-pointer"
            htmlFor="avatar"
          >
            <img
              className="absolute flex items-center justify-center w-44 h-44 rounded-full border border-gray-800 bg-center bg-cover"
              src="/images/profile.jpeg"
              id="profile-picture"
            />
            <p className="absolute text-gray-200 w-full h-full flex items-center justify-center rounded-full font-bold text-2xl tracking-wider">
              change
            </p>
          </label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/*"
            className="hidden p-4 rounded-md m-2 tracking-wider text-gray-800"
            onChange={readURL}
          />
        </div>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="username"
          className="p-4 rounded-md m-2 tracking-wider border border-gray-800"
          autoComplete="username"
          maxLength={12}
          pattern="/[A-Za-z]{12}"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          type="submit"
          onClick={handleLoginForm}
          className={`hover:bg-yellow-300 cursor-pointer transition duration-300 border border-gray-800 rounded-md bg-yellow-400 text-gray-800 m-2 p-3 font-bold font-mono tracking-wider ${
            0 && "opacity-50"
          }`}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CompleteUserProfileInfo;
