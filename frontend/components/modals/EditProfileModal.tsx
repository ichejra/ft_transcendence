import { useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { UpdateProfileForm } from "../auth/CompleteUserProfileInfo";
import { useAppDispatch } from "../../app/hooks";
import { editUserProfile } from "../../features/userProfileSlice";

const UsersModal: React.FC = () => {
  const divRef = useRef(null);
  const dispatch = useAppDispatch();

  return (
    <div
      onClick={(e) => {
        if (e.target == divRef.current) {
          dispatch(editUserProfile(false));
        }
      }}
      className="fixed top-0 left-0 z-10 bg-black bg-opacity-75 w-full h-full"
    >
      <div
        ref={divRef}
        className="flex flex-col justify-center items-center h-full"
      >
        <div className="bg-white w-5/6 md:w-1/3 rounded-xl py-4">
          <div className="flex justify-between items-center mx-2 mb-8 px-2 text-gray-700 bg-white">
            <h1 className="font-medium font-sans text-3xl">Edit profile</h1>
            <FaTimes
              size="2rem"
              className="cursor-pointer hover:text-yellow-400 transition duration-300"
              onClick={() => dispatch(editUserProfile(false))}
            />
          </div>
          <hr />
          <div className="mx-4 my-2">
            <UpdateProfileForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersModal;
