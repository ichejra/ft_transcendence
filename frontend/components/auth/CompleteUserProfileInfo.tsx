import React, { useEffect, useRef, useState } from "react";
import {
  completeProfileInfo,
  editUserProfile,
  completeUserInfo,
} from "../../features/userProfileSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router";
import { BiEditAlt } from "react-icons/bi";
//TODO refactor update info and complete info Componenet

const CompleteUserProfileInfo: React.FC = () => {
  return (
    <div className="fixed z-50 page-100 top-0 left-0 w-full h-full bg-black text-gray-300">
      <div className="w-full h-full flex justify-center">
        <div className="flex w-full h-full items-center justify-center 2xl:w-4/6  complete-info-cover-bg">
          <CompleteProfileInfo />
        </div>
      </div>
    </div>
  );
};

export const CompleteProfileInfo: React.FC = () => {
  const { loggedUser } = useAppSelector((state) => state.user);
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [isValid, setIsValid] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const readURL = (e: any) => {
    const img = document.getElementById("profile-picture") as HTMLImageElement;
    img.src = URL.createObjectURL(e.target.files[0]);
    setAvatar(e.target.files[0]);
    console.log("new img->", URL.createObjectURL(e.target.files[0]));
  };

  const handleLoginForm = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    if (isValid !== 2) return;
    const formData = new FormData();

    formData.append("file", avatar);
    formData.append("user_name", username);
    dispatch(
      completeProfileInfo({
        data: formData,
      })
    ).then(() => {
      navigate(`/profile/${loggedUser.id}`);
    });
    dispatch(completeUserInfo(false));
  };

  useEffect(() => {
    inputRef.current?.focus();
    dispatch(completeUserInfo(true));
  }, []);

  useEffect(() => {
    const usernameRegex = /^[a-z\d]{4,12}$/i;
    setIsValid(() => {
      if (!username) {
        return 0;
      }
      return !usernameRegex.test(username) ? 1 : 2;
    });
  }, [username]);
  //!=============
  return (
    <form className="relative flex flex-col items-center p-8 w-full h-full md:h-[400px] md:w-[600px] profile-card-bg-color border-[1px] border-gray-500 rounded-lg">
      <div className="absolute flex justify-center md:left-[14.8rem] m-2">
        <img
          className="w-32 h-32 rounded-full border border-white bg-center bg-cover"
          src={loggedUser.avatar_url}
          id="profile-picture"
        ></img>
        <label className="bg-red-200 cursor-pointer" htmlFor="avatar">
          <BiEditAlt className="absolute bottom-4 right-1 header-item hover:bg-blue-900 transition duration-500  bg-white rounded-full w-6 h-6 p-1 text-black"></BiEditAlt>
        </label>
        <input
          type="file"
          id="avatar"
          name="avatar"
          accept="image/*"
          className="hidden p-4 rounded-md m-2text-gray-800"
          onChange={readURL}
        />
      </div>
      <div className="relative flex flex-col md:items-center mt-[10rem]">
        <input
          ref={inputRef}
          type="text"
          id="username"
          name="username"
          autoComplete="off"
          placeholder="Username"
          className={`about-family px-4 py-2 focus:outline-none bg-transparent w-[275px] md:w-72 rounded-md m-2 border-gray-400 opacity-70 tracking-wider border-[1px] ${
            isValid === 1
              ? "focus:border-red-400"
              : isValid === 2
              ? "focus:border-green-400"
              : ""
          }`}
          maxLength={12}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {isValid === 1 ? (
          <p className={`pl-2 md:pl-0 w-72 text-xs text-red-400 font-thin`}>
            Username must be lowercase including numbers and contain 4 -
            12 characters
          </p>
        ) : isValid === 2 ? (
          <p className={`w-72 text-sm pl-2 text-green-400 font-thin`}>
            <span className="font-bold">{username}</span> is valid..
          </p>
        ) : (
          <></>
        )}
      </div>
      <button
        type="submit"
        onClick={handleLoginForm}
        className={`about-family transition duration-300 border-2 text-gray-900  bg-gray-200 hover:bg-white rounded-md  mt-4 m-2 p-1 w-[275px] md:w-72 tracking-wider ${
          isValid !== 2 && "opacity-50 cursor-auto"
        }`}
      >
        Submit
      </button>
    </form>
  );
};

export default CompleteUserProfileInfo;
