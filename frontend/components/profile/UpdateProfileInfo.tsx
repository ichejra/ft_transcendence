import React, { useEffect, useRef, useState } from "react";
import {
  completeProfileInfo,
  editUserProfile,
  enableTwoFactorAuth,
  disableTwoFactorAuth,
  generate2FAQrCode,
  firstVerify2FACode,
} from "../../features/userProfileSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { BiEditAlt } from "react-icons/bi";
import Swal from "sweetalert2";

export const UpdateProfileForm: React.FC = () => {
  const [avatar, setAvatar] = useState("");
  const [isValid, setIsValid] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const checkboxRef = useRef<any>(null);
  const dispatch = useAppDispatch();
  const { error, loggedUser, isLoading, qrCode } = useAppSelector(
    (state) => state.user
  );
  const [username, setUsername] = useState(loggedUser.user_name);
  const readURL = (e: any) => {
    const img = document.getElementById("profile-picture") as HTMLImageElement;
    img.src = URL.createObjectURL(e.target.files[0]);
    setAvatar(e.target.files[0]);
  };

  const handleProfileUpdate = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    if (isValid !== 2) return;
    const formData = new FormData();

    formData.append("file", avatar);
    formData.append("user_name", username);
    dispatch(
      completeProfileInfo({
        data: formData,
      })
    ).then((data: any) => {
      if (data.error) {
        setIsValid(0);
      } else {
        setIsValid(2);
        dispatch(editUserProfile(false));
      }
    });
  };

  const handleTwoFactorAuth = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (checked) {
      dispatch(generate2FAQrCode()).then(async (data: any) => {
        const { value: verificationCode } = await Swal.fire({
          imageUrl: data.payload,
          imageHeight: 200,
          imageAlt: "A tall image",
          confirmButtonText: "Confirm",
          showCancelButton: true,
          title: "Enter verification code",
          input: "text",
          inputPlaceholder: "XXX XXX",
          showLoaderOnConfirm: true,
          preConfirm: (code: string) => {
            return dispatch(firstVerify2FACode(code)).then((data: any) => {
              if (data.error) {
                Swal.showValidationMessage(`invalid code`);
              } else {
                Swal.fire({
                  icon: "success",
                  title: "2FA Enabled Successfully!",
                  showConfirmButton: false,
                  timer: 1500,
                });
                dispatch(enableTwoFactorAuth());
              }
            });
          },
        });
        if (!verificationCode) {
          checkboxRef.current.checked = false;
        }
      });
    } else {
      dispatch(disableTwoFactorAuth());
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
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

  return (
    <form className="relative flex flex-col p-8 h-full">
      <div className="absolute flex justify-center -top-[4rem] md:left-[18.2rem]">
        <img
          className="w-32 h-32 rounded-full border border-white bg-center bg-cover"
          src={loggedUser.avatar_url}
          alt={loggedUser.user_name}
          id="profile-picture"
        />
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
      <div className="relative flex flex-col md:items-center mt-14">
        <input
          ref={inputRef}
          type="text"
          id="username"
          name="username"
          autoComplete="off"
          placeholder="Username"
          className={`about-family px-4 py-2 focus:outline-none bg-transparent md:w-72 rounded-md m-2 border-gray-400 opacity-70 tracking-wider border-[1px] ${
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
          <p
            className={`pl-2 font-sans md:pl-0 w-72 text-[.6rem] text-red-400 font-thin`}
          >
            Username must be lowercase including numbers and contain 4 - 12
            characters
          </p>
        ) : isValid === 0 ? (
          <p className="w-72 font-sans text-[.8rem] font-thin text-red-500">
            {isLoading ? "Loading..." : error.status === 403 && error.message}
          </p>
        ) : (
          <p></p>
        )}
      </div>
      <div className="flex about-family tracking-wider items-center justify-center mt-2">
        <div className="flex items-center md:w-72">
          <label className="switch mr-2">
            <input
              ref={checkboxRef}
              type="checkbox"
              checked={loggedUser.is_2fa_enabled}
              onChange={handleTwoFactorAuth}
            />
            <span className="slider round"></span>
          </label>
          <p className="text-[1rem]">Enable 2FA</p>
        </div>
      </div>
      <div className="md:absolute flex justify-center items-end bottom-10 md:bottom-4 right-4 mt-5 md:mt-0">
        <button
          type="button"
          onClick={() => dispatch(editUserProfile(false))}
          className={`about-family transition duration-300 border-2 bg-transparent hover:opacity-70 border-gray-300 rounded-md  m-2 p-1 w-[200px] md:w-28 tracking-wider`}
        >
          cancel
        </button>
        <button
          type="submit"
          onClick={handleProfileUpdate}
          className={`about-family transition duration-300 border-2 text-gray-900  bg-gray-200 hover:bg-white rounded-md  m-2 p-1 w-[200px] md:w-28 tracking-wider ${
            isValid !== 2 && "opacity-50 cursor-auto"
          }`}
        >
          save
        </button>
      </div>
    </form>
  );
};
