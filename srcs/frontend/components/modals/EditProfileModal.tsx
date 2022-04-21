import { useRef } from "react";
import { UpdateProfileForm } from "../profile/UpdateProfileInfo";
import { useAppDispatch } from "../../app/hooks";
import { editUserProfile } from "../../features/userProfileSlice";

const EditProfileModal: React.FC = () => {
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
        <div className="profile-card-bg-color w-full h-full md:w-[700px] md:h-[516px] border-[1px] border-gray-700">
          <div className="h-[14rem] bg-red-200 profile-cover-bg"></div>
          <div className="h-[18rem]">
            <div className="relative h-full">
              <UpdateProfileForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
