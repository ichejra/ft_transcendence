import React, { useEffect, useRef, useState } from "react";
import {
  completeProfileInfo,
  editUserProfile,
} from "../../features/userProfileSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router";

const CompleteUserProfileInfo: React.FC = () => {
  return (
    <div className="absolute page-100 top-0 w-full h-full bg-white">
      <div className="page-100 flex flex-col top-0 items-center justify-center w-full h-full md:w-2/4 py-12 bg-gray-800 shadow-xl">
        <div className="bg-white rounded-xl w-5/6 md:w-3/4">
          <UpdateProfileForm />
        </div>
      </div>
    </div>
  );
};

export const UpdateProfileForm: React.FC = () => {
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [isValid, setIsValid] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const readURL = (e: any) => {
    const img = document.getElementById("profile-picture") as HTMLImageElement;
    img.src = URL.createObjectURL(e.target.files[0]);
    setAvatar(e.target.files[0]);
    console.log("new img->", URL.createObjectURL(e.target.files[0]));
  };

  const handleLoginForm = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    if (!isValid) return;
    const formData = new FormData();

    formData.append("avatar_url", avatar);
    // formData.append("user_name", username);

    console.log(
      "id: ",
      user.id,
      "data: ",
      // formData.get("user_name"),
      formData.get("avatar_url")
    );
    dispatch(
      completeProfileInfo({
        username,
        avatar: formData,
      })
    );
    dispatch(editUserProfile(false));
    navigate(`/profile/${user.id}`);
  };

  useEffect(() => {
    const usernameRegex = /^[a-z\d]{5,12}$/i;
    setIsValid(usernameRegex.test(username));
  }, [username]);

  return (
    <form className="flex flex-col p-8 justify-center space-y-6">
      <div className="flex justify-center">
        <label
          className="relative w-44 h-44 rounded-full hover:opacity-50 cursor-pointer"
          htmlFor="avatar"
        >
          <img
            className="absolute flex items-center justify-center w-44 h-44 rounded-full border border-gray-800 bg-center bg-cover"
            src={user.avatar_url}
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
      <div className="flex flex-col">
        <input
          ref={inputRef}
          type="text"
          id="username"
          name="username"
          autoComplete="off"
          placeholder="username"
          className={`p-4 rounded-md m-2 tracking-wider border-2 ${
            !isValid ? "border-red-400" : "border-green-400"
          }`}
          maxLength={12}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <p
          className={`text-sm mx-2 text-red-400 ${
            !isValid ? "block" : "hidden"
          }`}
        >
          Username must be lowercase including numbers and '_' and contain 5 -
          12 characters
        </p>
      </div>
      <button
        type="submit"
        onClick={handleLoginForm}
        className={`hover:bg-yellow-300 cursor-pointer transition duration-300 border border-gray-800 rounded-md bg-yellow-400 text-gray-800 m-2 p-3 font-bold font-mono tracking-wider ${
          !isValid && "opacity-25 cursor-auto"
        }`}
      >
        Submit
      </button>
    </form>
  );
};

export default CompleteUserProfileInfo;
