import { FaUserFriends } from "react-icons/fa";
import { AiFillCalendar } from "react-icons/ai";
import { RiPingPongFill } from "react-icons/ri";
import { GoPrimitiveDot } from "react-icons/go";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import EditProfileModal from "../modals/EditProfileModal";
import {
  User,
  editUserProfile,
  fetchNoRelationUsers,
  fetchUserFriends,
  setIsPending,
  setIsFriend,
  setIsLoading,
  setIsBlocked,
} from "../../features/userProfileSlice";
import { useNavigate, useParams } from "react-router";
import { PButton } from "../utils/Button";
import { useEffect } from "react";
import Cookies from "js-cookie";
import {
  fetchBlockedUsers,
  fetchPendingStatus,
  fetchRequestStatus,
  removeFriendRelation,
  blockUserRequest,
} from "../../features/friendsManagmentSlice";
import { socket } from "../../pages/SocketProvider";
import swal from "sweetalert";

interface Props {
  user_me: User;
  users: User[];
  friends: User[];
}

const ProfileHeader: React.FC<Props> = ({ user_me, users, friends }) => {
  //!useNavigate
  const navigate = useNavigate();

  //! useParams
  const { id: profileID } = useParams();

  //! useAppDispatch
  const dispatch = useAppDispatch();

  //! useAppSelector
  const {
    editProfile,
    loggedUser,
    isPending,
    isFriend,
    isBlocked,
    isPageLoading,
  } = useAppSelector((state) => state.user);
  const { pendingUsers } = useAppSelector((state) => state.friends);
  const { refresh } = useAppSelector((state) => state.globalState);
  const { isLoading } = useAppSelector((state) => state.user);

  const addFriend = (id: number) => {
    if (Cookies.get("accessToken")) {
      dispatch(setIsLoading(true));
      dispatch(fetchRequestStatus(id.toString())).then(() => {
        dispatch(fetchPendingStatus()).then(() => {
          dispatch(fetchNoRelationUsers());
          dispatch(setIsPending(true));
          socket.emit("send_notification", { userId: id });
          dispatch(setIsLoading(false));
        });
      });
    }
  };

  const removeFriend = (id: number) => {
    if (Cookies.get("accessToken")) {
      dispatch(setIsLoading(true));
      dispatch(removeFriendRelation(id))
        .then(() => {
          dispatch(fetchUserFriends());
          dispatch(fetchNoRelationUsers());
          socket.emit("send_notification", { userId: id });
        })
        .then(() => {
          dispatch(setIsFriend(false));
          dispatch(setIsLoading(false));
        });
    }
  };

  const cancelRequest = (id: number) => {
    if (Cookies.get("accessToken")) {
      dispatch(setIsLoading(true));
      dispatch(removeFriendRelation(id))
        .then(() => {
          dispatch(fetchUserFriends());
          dispatch(fetchNoRelationUsers());
          socket.emit("send_notification", { userId: id });
        })
        .then(() => {
          dispatch(setIsFriend(false));
          dispatch(setIsPending(false));
          dispatch(setIsLoading(false));
        });
    }
  };

  //! #######################
  const blockUser = (id: number) => {
    dispatch(setIsLoading(true));
    if (Cookies.get("accessToken")) {
      dispatch(blockUserRequest(id)).then(() => {
        dispatch(fetchBlockedUsers()).then(() => {
          dispatch(fetchUserFriends()).then(() => {
            dispatch(fetchNoRelationUsers());
            dispatch(setIsBlocked(true));
            dispatch(setIsLoading(false));
            navigate(`/users/${loggedUser.id}/blocked`);
            socket.emit("send_notification", { userId: id });
          });
        });
      });
    }
  };
  //! #######################

  const handleInviteToGame = (user: User) => {
    console.log(loggedUser.id, " sent invit to: ", user.id);
    swal("Choose the game type", {
      buttons: {
        Default: true,
        Obstacle: true,
      },
    }).then((value) => {
      console.log(value);
      if (value === "Default") {
        socket.emit("invite_to_game", {
          inviter: loggedUser,
          invitee: user,
          gameType: "default",
        });
      } else if (value === "Obstacle") {
        socket.emit("invite_to_game", {
          inviter: loggedUser,
          invitee: user,
          gameType: "obstacle",
        });
      }
    });
  };

  const editMyProfile = () => {
    dispatch(editUserProfile(true));
  };

  useEffect(() => {
    console.log("0001");
    dispatch(setIsLoading(true));
    dispatch(fetchUserFriends()).then((data: any) => {
      const userFriends: User[] = data.payload;
      dispatch(
        setIsFriend(
          userFriends.find((user) => user.id === Number(profileID)) !==
            undefined
            ? true
            : false
        )
      );
      dispatch(setIsLoading(false));
    });
  }, [profileID, refresh, isFriend, isBlocked]);

  return (
    <div className="relative w-full">
      <div className="profile-cover-bg w-full md:h-80 flex justify-center border-b-[1px] md:border-none border-gray-700">
        <div className="md:absolute md:border-[1px] border-gray-700 profile-card-bg-color md:top-[12rem] sm:left-[3rem] w-full md:w-[22rem] xl:w-96 p-6 md:p-8 text-white text-opacity-80">
          {isPageLoading ? (
            <div className="loading-2 border-2 border-blue-600 w-20 h-20"></div>
          ) : (
            <div>
              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 text-center md:text-left">
                <div className="relative md:mr-4 w-28 h-28 md:w-20 md:h-20">
                  {user_me.state === "online" ? (
                    <GoPrimitiveDot
                      size="1.5rem"
                      className="absolute text-green-500 right-[4px] bottom-[2px] md:right-[1px] md:-bottom-[2px]"
                    />
                  ) : user_me.state === "in_game" ? (
                    <GoPrimitiveDot
                      size="1.5rem"
                      className="absolute text-orange-400 right-[4px] bottom-[2px] md:right-[1px] md:-bottom-[2px]"
                    />
                  ) : (
                    <GoPrimitiveDot
                      size="1.5rem"
                      className="absolute text-gray-400 right-[4px
                      ] bottom-[2px] md:right-[1px] md:-bottom-[2px]"
                    />
                  )}
                  <img
                    src={user_me.avatar_url}
                    className="w-28 h-28 md:w-20 md:h-20 rounded-full"
                  />
                </div>
                <div className="w-[200px]">
                  <p className="text-[14px] w-full about-title-family">
                    {user_me.display_name}
                  </p>
                  <p className="about-family md:text-[12px]">
                    @{user_me.user_name}
                  </p>
                </div>
              </div>
              <div className="flex space-x-6 about-family py-6 justify-center md:justify-start">
                <div className="flex font-normal text-sm">
                  <AiFillCalendar size="1.1rem" className="mr-2" />
                  <p className="text-[10px]">
                    {new Date(user_me.createdAt).toLocaleString("default", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {loggedUser.id === Number(profileID) && (
                  <div className="flex font-normal text-sm">
                    <FaUserFriends size="1.1rem" className="mr-2" />
                    <p className="text-[10px]">{friends.length} friends</p>
                  </div>
                )}
              </div>
              {/* <div className="h-full pb-6 w-full text-center">
             <div className="rounded-full border border-gray-600 h-full w-full mb-2 flex">
              <div className="rounded-l-full about-family text-sm w-2/3 txt-cyan bg-blue-400">
                7.5
              </div>
            </div> 
            <div className="font-sans h-full w-full mb-2 flex">
              <div className="rounded-l-full font-bold text-sm w-2/3 bg-green-600">
                10 wins
              </div>
              <div className="rounded-r-full font-bold text-sm w-1/3 bg-red-500">
                5 loses
              </div>
            </div>
          </div> */}
              <div className="flex justify-center md:justify-start">
                {loggedUser.id !== Number(profileID) ? (
                  <div className="w-full flex flex-col items-center md:items-start">
                    {!isFriend && !isPending && !pendingUsers.length && (
                      <PButton
                        type={"Add Friend"}
                        func={addFriend}
                        id={user_me.id}
                        style="bg-blue txt-cyan mb-1"
                        icon={2}
                      />
                    )}
                    {isFriend && (
                      <div className="w-full flex flex-col items-center md:items-start">
                        <PButton
                          func={removeFriend}
                          type="Unfriend"
                          id={user_me.id}
                          style="bg-blue-400 text-cyan-200"
                          icon={3}
                        />
                        <PButton
                          func={blockUser}
                          type="Block"
                          id={user_me.id}
                          style="bg-red-500 text-cyan-200 mt-2"
                          icon={4}
                        />
                      </div>
                    )}
                    {isPending && (
                      <PButton
                        func={cancelRequest}
                        type="Cancel Request"
                        id={user_me.id}
                        style="bg-blue-400 text-cyan-200"
                        icon={3}
                      />
                    )}
                    <button
                      onClick={() => handleInviteToGame(user_me)}
                      className={`hover:scale-105 mt-2 transition duration-300 w-[214px] h-[37px] rounded-md about-family bg-green-600`}
                    >
                      {isLoading ? (
                        <div className="loading-2 border border-cyan-200 w-6 h-6"></div>
                      ) : (
                        <span className="flex items-center justify-center">
                          <RiPingPongFill size="1.5rem" className="mr-2" />
                          Challenge
                        </span>
                      )}
                    </button>
                  </div>
                ) : (
                  <PButton
                    func={editMyProfile}
                    type="Edit Profile"
                    id={user_me.id}
                    style="bg-blue txt-cyan"
                    icon={1}
                  />
                )}
                {editProfile && <EditProfileModal />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
