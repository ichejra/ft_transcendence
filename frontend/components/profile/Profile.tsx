import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ProfileHeader, ProfileInfo, FriendsList } from ".";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { SiAdblock } from "react-icons/si";
import {
  fetchCurrentUser,
  fetchSingleUser,
  fetchUserFriends,
  setIsPageLoading,
} from "../../features/userProfileSlice";

const UserProfile: React.FC = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const dispatch = useAppDispatch();
  const {
    users,
    isError,
    loggedUser,
    user,
    friends,
    editProfile,
    completeInfo,
    isPageLoading,
  } = useAppSelector((state) => state.user);
  const { id } = useParams();

  useEffect(() => {
    if (editProfile === false && Number(id) === loggedUser.id) {
      console.log("4. Profile updated");
      dispatch(fetchUserFriends());
    }
    if (Number(id) === loggedUser.id) {
      dispatch(setIsPageLoading(true));
      dispatch(fetchCurrentUser()).then(() =>
        dispatch(setIsPageLoading(false))
      );
    }
  }, [editProfile, completeInfo]);

  useEffect(() => {
    console.log("-->", user);

    if (Number(id) !== loggedUser.id) {
      dispatch(setIsPageLoading(true));
      dispatch(fetchSingleUser(Number(id))).then((response: any) => {
        console.log("-->", response);
        if (response.error) {
          setErrorMsg(response.error.message);
        } else {
          setErrorMsg("");
        }
        dispatch(setIsPageLoading(false));
      });
    } else {
      setErrorMsg("");
    }
  }, [id]);

  console.log(id);

  if (isPageLoading) {
    return (
      <div className="page-100 mt-20 flex justify-center bg-black">
        <div className="flex flex-col w-full 2xl:w-[80rem] items-center shadow-xl rounded-none lg:rounded-xl">
          <div className="loading w-44 h-44"></div>
        </div>
      </div>
    );
  }
  if (errorMsg === "Rejected") {
    return (
      <div className="page-100 mt-20 flex justify-center bg-black">
        <div className="flex flex-col w-full text-gray-300 2xl:w-[80rem] items-center justify-center shadow-xl rounded-none lg:rounded-xl">
          <SiAdblock size="18rem" className="p-6 m-2" />
          <p className="about-title-family">
            This page isn't accessible right now
          </p>
          <Link to="/">
            <button className="hover:text-gray-300 hover:bg-transparent transition duration-300 bg-gray-300 text-gray-900 px-4 py-2 m-4 w-48 border rounded-lg about-family">
              Back Home
            </button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="page-100 mt-20 flex justify-center bg-black">
      <div className="flex flex-col w-full 2xl:w-[80rem] items-center shadow-xl rounded-none lg:rounded-xl">
        <ProfileHeader
          user_me={Number(id) === loggedUser.id ? loggedUser : user}
          users={users}
          friends={friends}
        />
        <div className="w-full mt-4">
          <ProfileInfo
            user_me={Number(id) === loggedUser.id ? loggedUser : user}
            users={users}
          />
          {loggedUser.id === Number(id) && <FriendsList friends={friends} />}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

//TODO add blocked users list
//TODO add unblock button to blocked users in blokeduserslist
//TODO fix profile buttons state
