import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IoMdSend, IoMdExit } from "react-icons/io";
import { GoPrimitiveDot } from "react-icons/go";
import { RiListSettingsLine } from "react-icons/ri";
import { MdSettings } from "react-icons/md";
import { FaUserFriends, FaTimes } from "react-icons/fa";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useParams } from "react-router";
import { socket } from "../../pages/SocketProvider";
import { useNavigate } from "react-router";
import { updateChannelContent } from "../../features/globalSlice";
import { User } from "../../features/userProfileSlice";
import UpdateChannelModal from "../modals/UpdateChannelModal";
import swal from "sweetalert";
import Member from "./Member";
import {
  getChannelMembersList,
  updateChannelState,
  getChannelsList,
  ChannelMessage,
  setUpdateChannelModal,
  getLoggedUserRole,
  setNewChannelId,
  ChannelMember,
  ChannelOwner,
  setShowMembersList,
} from "../../features/chatSlice";
interface ContentProps {
  channelName: string;
  currentChannelID: number;
  channelOwner: User;
}

const ChannelContent: React.FC<ContentProps> = ({
  channelName,
  channelOwner,
  currentChannelID,
}) => {
  const [message, setMessage] = useState("");
  const [toggleMenu, setToggleMenu] = useState(false);
  const menuRef = useRef<any>(null);
  const messagesDivRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { updateMessages, membersList } = useAppSelector(
    (state) => state.globalState
  );
  const { loggedUser } = useAppSelector((state) => state.user);
  const {
    channelContent,
    channelMembers,
    memberStatus,
    loggedMemberRole,
    updateChannelModal,
    showMembersList,
  } = useAppSelector((state) => state.channels);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    dispatch(getLoggedUserRole(Number(params.id))).then((data: any) => {
      const loggedMember: ChannelOwner = data.payload;
      console.log("-_-_-_-_>>", loggedMember.userStatus);
      socket.emit("send_message_channel", {
        channelId: params.id,
        content: message,
        room: channelName,
        senderStatus: loggedMember.userStatus,
      });
      setMessage("");
      messagesDivRef.current?.scrollTo({
        left: 0,
        top: messagesDivRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  const handleChange = (e: any) => {
    const value = e.target.value;
    if (value.length > 200) {
      return;
    }
    setMessage(e.target.value);
  };

  const leaveChannel = async () => {
    socket.emit("leave_channel", {
      channelId: params.id,
      removeChannel:
        channelOwner.id === loggedUser.id &&
        channelMembers.filter((member) => member.userRole === "admin")
          .length === 0,
    });
    dispatch(getChannelsList()).then(() => {
      navigate("/channels");
      dispatch(setNewChannelId({ id: -1, render: false }));
      dispatch(updateChannelState());
    });
  };

  useEffect(() => {
    messagesDivRef.current?.scrollTo({
      left: 0,
      top: messagesDivRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [updateMessages]);

  useEffect(() => {
    console.log(
      "[Member] newChannelId --------->",
      Number(params.id),
      currentChannelID,
      memberStatus
    );
    if (currentChannelID !== -1) {
      dispatch(getChannelMembersList(currentChannelID));
      dispatch(getLoggedUserRole(currentChannelID));
    }
  }, [memberStatus]);

  useEffect(() => {
    console.log("[ChannelContent] >>>>>> ", params.id, currentChannelID);
    if (currentChannelID) {
      dispatch(getChannelMembersList(currentChannelID));
    }
  }, [membersList]);

  useEffect(() => {
    // *************** share member status socket
    socket.on("member_status_changed", (data) => {
      console.log(
        "member status changed ==><==",
        data.channelId,
        currentChannelID
      );
      dispatch(getChannelMembersList(data.channelId));
      dispatch(getLoggedUserRole(data.channelId));
    });

    // *************** apply member status socket
    socket.on("update_member_status", (data) => {
      console.log(
        "%cmember status changed: ",
        "color:pink",
        data.memberId,
        data.channelId
      );
      if (data.memberId === loggedUser.id) {
        if (data.status === "kick" || data.status === "ban") {
          dispatch(getChannelMembersList(data.channelId)).then(() => {
            navigate("/channels");
            dispatch(setNewChannelId({ id: -1, render: false }));
            dispatch(updateChannelState());
          });
        } else {
          dispatch(getChannelMembersList(data.channelId));
        }
      }
    });
    return () => {
      socket.off("member_status_changed");
      socket.off("update_member_status");
    };
  }, [params.id]);

  useEffect(() => {
    const updateUserMenu = (e: Event) => {
      if (
        toggleMenu &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setToggleMenu(false);
      }
    };
    document.addEventListener("mousedown", updateUserMenu);
    return () => {
      document.removeEventListener("mousedown", updateUserMenu);
    };
  }, [toggleMenu]);

  return (
    <div className="relative text-white right-0 flex h-full w-full">
      <div className="relative w-full">
        <div className="fixed user-card-bg border-b border-l border-gray-700 shadow-gray-700 shadow-sm left-[4.2rem] md:left-[7.4rem] text-white p-1 md:p-2 right-0 flex items-center justify-between">
          <h1 className="md:text-xl">#{channelName.split(" ").join("-")}</h1>
          <div ref={menuRef} className="flex items-center">
            <FaUserFriends
              size="2rem"
              onClick={() => dispatch(setShowMembersList(true))}
              className="block md:hidden mr-2 hover:scale-110 transition duration-300 hover:text-blue-400 cursor-pointer"
            />
            {loggedMemberRole.userRole === "owner" ? (
              <RiListSettingsLine
                onClick={() => {
                  setToggleMenu(true);
                  dispatch(setShowMembersList(false));
                }}
                size="2rem"
                className="mr-2 hover:scale-110 transition duration-300 hover:text-blue-400 cursor-pointer"
              />
            ) : (
              <div
                onClick={leaveChannel}
                className="border-gray-500 user-card-bg flex items-center cursor-pointer hover:scale-105 hover:text-blue-400 transition duration-300"
              >
                <p className="hidden md:block text-md">Leave</p>
                <IoMdExit size="2rem" className="ml-2" />
              </div>
            )}
            {toggleMenu && (
              <div className="absolute z-10 top-2 border-gray-500 w-[150px] user-card-bg border user-menu">
                <ul className="">
                  <li
                    onClick={() => {
                      dispatch(setUpdateChannelModal(true));
                    }}
                    className="flex items-center p-1 m-1 font-mono text-sm font-bold hover:bg-opacity-40 hover:bg-gray-400 transition duration-300 cursor-pointer"
                  >
                    <MdSettings size="1.5rem" className="mr-2" />
                    Settings
                  </li>
                  <li
                    onClick={leaveChannel}
                    className="flex items-center p-1 m-1 font-mono text-sm font-bold hover:bg-opacity-40 hover:bg-gray-400 transition duration-300 cursor-pointer"
                  >
                    <IoMdExit size="1.5rem" className="mr-2" />
                    Leave
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <ChannelMessages
          messagesDivRef={messagesDivRef}
          channelContent={channelContent}
        />
        {loggedMemberRole.userStatus !== "muted" ? (
          <MessageForm
            message={message}
            handleChange={handleChange}
            sendMessage={sendMessage}
          />
        ) : (
          <div className="absolute bottom-20 flex justify-center items-center w-full h-[60px] bg-red-600">
            <p className="flex items-center font-sans">You have been muted</p>
          </div>
        )}
      </div>
      <div className="hidden md:block h-full pt-12 px-4 my-2 w-[400px] border-l border-gray-700 user-card-bg">
        <ChannelMembersList
          channelOwner={channelOwner}
          channelMembers={channelMembers}
          channelName={channelName}
          currentChannelID={currentChannelID}
        />
      </div>
      {showMembersList && (
        <div className="block md:hidden absolute top-9 right-0 h-full px-4 my-2 w-full border-l border-gray-700 user-card-bg">
          <FaTimes
            size="2rem"
            onClick={() => dispatch(setShowMembersList(false))}
            className="absolute font-sans mt-1 right-2 hover:text-blue-400 transition duration-300 cursor-pointer"
          />
          <div className="mt-8">
            <ChannelMembersList
              channelOwner={channelOwner}
              channelMembers={channelMembers}
              channelName={channelName}
              currentChannelID={currentChannelID}
            />
          </div>
        </div>
      )}
      {updateChannelModal && (
        <UpdateChannelModal
          channelId={currentChannelID}
          channelOldName={channelName}
        />
      )}
    </div>
  );
};

//? Channel Members___________________

interface ChannelMembersProps {
  channelOwner: User;
  channelMembers: ChannelMember[];
  channelName: string;
  currentChannelID: number;
}

const ChannelMembersList: React.FC<ChannelMembersProps> = ({
  channelOwner,
  channelMembers,
  channelName,
  currentChannelID,
}) => {
  const { loggedUser } = useAppSelector((state) => state.user);

  const inviteToGame = (user: User) => {
    console.log(loggedUser.id, " sent invit to: ", user.id);
    swal("Regular Pong or Our Pong?", "", {
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

  return (
    <>
      <h1 className="text-gray-300 pb-2">Owner</h1>
      <div className="relative flex items-center">
        <div className="relative">
          {channelOwner.state === "online" ? (
            <GoPrimitiveDot
              size="1.3rem"
              className="absolute text-green-400 right-[1px] -bottom-[2px]"
            />
          ) : channelOwner.state === "in_game" ? (
            <GoPrimitiveDot
              size="1.3rem"
              className="absolute text-orange-400 right-[1px] -bottom-[2px]"
            />
          ) : (
            <GoPrimitiveDot
              size="1.3rem"
              className="absolute text-gray-400 right-[1px] -bottom-[2px]"
            />
          )}
          <img
            src={channelOwner.avatar_url}
            className="w-10 h-10 rounded-full mr-2"
          />
        </div>
        <div>
          <Link to={`/profile/${channelOwner.id}`}>
            <p
              className={`text-blue-400 hover:underline transition duration-300 cursor-pointer flex items-center`}
            >
              {channelOwner.user_name}
            </p>
          </Link>
          <p className="text-[12px] font-thin text-gray-400">
            {channelOwner.state}
          </p>
        </div>
        {loggedUser.id !== channelOwner.id && channelOwner.state !== "in_game" && (
          <button
            onClick={() => inviteToGame(channelOwner)}
            className="absolute right-8 bg-green-400 py-1 px-2 text-[12px] ml-4 rounded-sm hover:scale-105 hover:bg-green-300 transition duration-300"
          >
            invite
          </button>
        )}
      </div>
      {[...channelMembers].filter((member) => member.userRole === "admin")
        .length ? (
        <div>
          <UsersList
            members={[...channelMembers].filter(
              (member) => member.userRole === "admin"
            )}
            inviteToGame={inviteToGame}
            channelName={channelName}
            title="Admins"
            currentChannelID={currentChannelID}
          />
        </div>
      ) : (
        <div></div>
      )}
      {[...channelMembers].filter((member) => member.userRole === "member")
        .length ? (
        <div>
          <UsersList
            members={[...channelMembers].filter(
              (member) => member.userRole === "member"
            )}
            inviteToGame={inviteToGame}
            channelName={channelName}
            title="Members"
            currentChannelID={currentChannelID}
          />
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

interface UsersListProps {
  members: ChannelMember[];
  currentChannelID: number;
  channelName: string;
  title: string;
  inviteToGame: (user: User) => void;
}

const UsersList: React.FC<UsersListProps> = ({
  members,
  currentChannelID,
  channelName,
  title,
  inviteToGame,
}) => {
  return (
    <div>
      <h1 className="text-gray-300 mt-3">{title}</h1>
      {members.map((member) => {
        return (
          <Member
            inviteToGame={inviteToGame}
            key={member.id}
            chId={currentChannelID}
            {...member}
            channelName={channelName}
          />
        );
      })}
    </div>
  );
};

//? Channel Messages________________
interface ChannelMessagesProps {
  messagesDivRef: React.RefObject<HTMLDivElement>;
  channelContent: ChannelMessage[];
}

const ChannelMessages: React.FC<ChannelMessagesProps> = ({
  messagesDivRef,
  channelContent,
}) => {
  return (
    <div
      ref={messagesDivRef}
      className="mx-3 md:mx-6 pt-8 md:pt-10 pb-52 h-full channels-bar-bg overflow-auto no-scrollbar"
    >
      {channelContent.map((message) => {
        const { id, createdAt, content, author } = message;
        return (
          <div key={id} className="my-6 mr-2 flex about-family items-start">
            <img
              src={author?.avatar_url}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full mr-2"
            />
            <div>
              <p className="text-gray-300 text-sm md:text-lg">
                {author?.user_name}
                <span className="text-gray-500 text-[8px] md:text-xs mx-1">
                  {new Date(createdAt).toLocaleString("default", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </p>
              <p className="text-xs font-sans font-bold max-w-screen break-all">
                {content}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

//? Send Message Form________________
interface FormProps {
  message: string;
  handleChange: (e: any) => void;
  sendMessage: (e: React.FormEvent) => void;
}

const MessageForm: React.FC<FormProps> = ({
  message,
  handleChange,
  sendMessage,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { id: channelId } = useParams();

  useEffect(() => {
    inputRef.current?.focus();
  }, [channelId]);

  return (
    <div className="absolute channels-bar-bg bottom-20 w-full">
      <form className="flex relative items-center mx-2 mb-2 px-2 pb-2">
        <input
          ref={inputRef}
          type="text"
          value={message}
          maxLength={200}
          onChange={(e) => handleChange(e)}
          placeholder="new message"
          className="w-full p-3 pr-12 rounded-md user-card-bg border border-gray-700 text-gray-200 text-sm"
        />
        <button
          onClick={sendMessage}
          type="submit"
          className="absolute right-2"
        >
          <IoMdSend
            size="1.5rem"
            className="m-2 text-white hover:scale-125 transition duration-300"
          />
        </button>
      </form>
    </div>
  );
};

export default ChannelContent;
