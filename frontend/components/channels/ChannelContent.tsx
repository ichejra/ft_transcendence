import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IoMdSend, IoMdExit } from "react-icons/io";
import { GoPrimitiveDot } from "react-icons/go";
import { RiListSettingsLine } from "react-icons/ri";
import { MdSettings } from "react-icons/md";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useParams } from "react-router";
import { socket } from "../../pages/SocketProvider";
import { useNavigate } from "react-router";
import { updateChannelContent } from "../../features/globalSlice";
import { User } from "../../features/userProfileSlice";
import UpdateChannelModal from "../modals/UpdateChannelModal";
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
    muteMember,
    memberStatus,
    loggedMemberRole,
    updateChannelModal,
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
  }, []);

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
        <div className="fixed user-card-bg border-b border-l border-gray-700 shadow-gray-700  shadow-sm left-[7.4rem] text-white p-2 right-0 flex items-center justify-between">
          <h1 className="text-xl">#{channelName.split(" ").join("-")}</h1>
          <div ref={menuRef}>
            {loggedMemberRole.userRole === "owner" ? (
              <RiListSettingsLine
                onClick={() => setToggleMenu(true)}
                size="2rem"
                className="mr-2 hover:scale-110 transition duration-300 hover:text-blue-400 cursor-pointer"
              />
            ) : (
              <div
                onClick={leaveChannel}
                className="border-gray-500 user-card-bg flex cursor-pointer hover:scale-105 hover:text-blue-400 transition duration-300"
              >
                Leave
                <IoMdExit size="1.5rem" className="ml-2" />
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
        <MessageForm
          message={message}
          handleChange={handleChange}
          sendMessage={sendMessage}
        />
      </div>
      <div className="h-full pt-12 px-4 my-2 w-[400px] border-l border-gray-700 user-card-bg">
        <h1 className="text-gray-300 pb-2">Owner</h1>
        <div className="flex items-center">
          <div className="relative">
            {channelOwner.state === "online" ? (
              <GoPrimitiveDot
                size="1.3rem"
                className="absolute text-green-400 right-[1px] -bottom-[2px]"
              />
            ) : (
              <GoPrimitiveDot
                size="1.3rem"
                className="absolute text-gray-400 right-[1px] -bottom-[2px]"
              />
            )}
            <img
              src={channelOwner.avatar_url}
              className="w-10 rounded-full mr-2"
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
            <p className="text-[12px] font-thin text-gray-400">owner</p>
          </div>
        </div>
        {channelMembers.filter((member) => member.userRole === "admin")
          .length ? (
          <div>
            <UsersList
              members={channelMembers.filter(
                (member) => member.userRole === "admin"
              )}
              channelName={channelName}
              title="Admins"
              currentChannelID={currentChannelID}
            />
          </div>
        ) : (
          <div></div>
        )}
        {channelMembers.filter((member) => member.userRole === "member")
          .length ? (
          <div>
            <UsersList
              members={channelMembers.filter(
                (member) => member.userRole === "member"
              )}
              channelName={channelName}
              title="Members"
              currentChannelID={currentChannelID}
            />
          </div>
        ) : (
          <div></div>
        )}
        {updateChannelModal && (
          <UpdateChannelModal
            channelId={currentChannelID}
            channelOldName={channelName}
          />
        )}
      </div>
    </div>
  );
};

//? Channel Members___________________
interface UsersListProps {
  members: ChannelMember[];
  currentChannelID: number;
  channelName: string;
  title: string;
}

const UsersList: React.FC<UsersListProps> = ({
  members,
  currentChannelID,
  channelName,
  title,
}) => {
  return (
    <div>
      <h1 className="text-gray-300 mt-3">{title}</h1>
      {members.map((member) => {
        return (
          <Member
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
      className="mx-6 pt-10 pb-52 h-full channels-bar-bg overflow-auto no-scrollbar"
    >
      {channelContent.map((message) => {
        const { id, createdAt, content, author } = message;
        return (
          <div key={id} className="my-6 mr-2 flex about-family items-start">
            <img
              src={author?.avatar_url}
              className="w-10 h-10 rounded-full mr-2"
            />
            <div>
              <p className="text-gray-300 text-lg">
                {author?.user_name}
                <span className="text-gray-500 text-xs mx-1">
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

//TODO customize the join channel form
