import React, { useEffect, useRef, useState } from "react";
import { IoMdSend, IoMdExit } from "react-icons/io";
import { RiListSettingsLine } from "react-icons/ri";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useParams } from "react-router";
import { socket } from "../../pages/SocketProvider";
import { useNavigate } from "react-router";
import { updateChannelContent } from "../../features/globalSlice";
import {
  getChannelMembersList,
  ChannelMember,
  addNewMessage,
  updateChannelState,
  setMuteCountDown,
  endMuteCountDown,
  getChannelsList,
  setIsAdmin,
  setIsOwner,
  setIsMute,
} from "../../features/chatSlice";
import Member from "./Member";
import { clear } from "console";
interface ContentProps {
  channelName: string;
  channelID: number;
}

const ChannelContent: React.FC<ContentProps> = ({ channelName, channelID }) => {
  const [message, setMessage] = useState("");
  const messagesDivRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const msgContainerRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const {
    channelContent,
    channelMembers,
    muteMember,
    memberStatus,
    isAdmin,
    isOwner,
  } = useAppSelector((state) => state.channels);
  const { updateMessages, membersList } = useAppSelector(
    (state) => state.globalState
  );
  const { loggedUser } = useAppSelector((state) => state.user);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    socket.emit("send_message_channel", {
      channelId: params.id,
      content: message,
      room: channelName,
    });
    setMessage("");
    messagesDivRef.current?.scrollTo({
      left: 0,
      top: messagesDivRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleChange = (e: any) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    messagesDivRef.current?.scrollTo({
      left: 0,
      top: messagesDivRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [updateMessages]);

  //TODO render leave channel
  const leaveChannel = async () => {
    socket.emit("leave_channel", { channelId: params.id });
    dispatch(getChannelsList()).then(() => {
      navigate("/channels");
      dispatch(updateChannelState());
    });
  };

  useEffect(() => {
    //? ************** sed message socket
    socket.on("receive_message_channel", (data: any) => {
      dispatch(updateChannelContent());
      dispatch(addNewMessage(data));
    });

    //? ************** leave socket
    socket.on(
      "leave_success",
      (data: { message: string; status: number; channelId: number }) => {
        dispatch(getChannelMembersList(data.channelId));
        console.log("%cleaved the channel", "color:red");
      }
    );
    //? *************** share member status socket
    socket.on("member_status_changed", () => {
      console.log("member status changed ==><==");
      dispatch(getChannelMembersList(channelID));
    });

    //? *************** apply member status socket
    socket.on("update_member_status", (data) => {
      let timer;
      console.log("%cmember status changed: ", "color:pink", channelID);
      if (data.status === "kick" || data.status === "ban") {
        dispatch(getChannelMembersList(channelID)).then(() => {
          navigate("/channels");
          dispatch(updateChannelState());
        });
      } else if (data.status === "mute") {
        dispatch(getChannelMembersList(channelID));
        dispatch(setMuteCountDown());
        //TODO ** unmute member when the timer is done
        timer = setTimeout(() => {
          dispatch(endMuteCountDown("active"));
          dispatch(setIsMute(false));
          dispatch(getChannelMembersList(channelID));
          console.log(memberStatus);
        }, data.time * 1000);
      } else if (data.status === "unmute") {
        clearTimeout(timer);
        dispatch(endMuteCountDown("active"));
        dispatch(getChannelMembersList(channelID));
      } else if (data.status === "unban") {
        dispatch(getChannelMembersList(channelID));
      } else if (data.status === "set_admin") {
        dispatch(setIsAdmin(true));
        dispatch(getChannelMembersList(channelID));
      } else if (data.status === "remove_admin") {
        dispatch(setIsAdmin(false));
        dispatch(getChannelMembersList(channelID));
      }
    });
    return () => {
      socket.off("receive_message_channel");
      socket.off("member_status_changed");
      socket.off("update_member_status");
      socket.off("leave_success");
    };
  }, []);

  useEffect(() => {
    console.log("xxxxxxxxxxxxx>>>>>> ", params.id, membersList);
    if (Number(params.id)) {
      dispatch(getChannelMembersList(Number(params.id)));
    }
  }, [membersList]);

  //TODO ADD isOwner state
  useEffect(() => {
    const checkMember = [...channelMembers].find(
      (member: ChannelMember) => member.user.id === loggedUser.id
    );
    if (checkMember) {
      if (checkMember.userRole === "admin") {
        dispatch(setIsAdmin(true));
      } else if (checkMember.userRole === "owner") {
        dispatch(setIsOwner(true));
      } else {
        dispatch(setIsAdmin(false));
        dispatch(setIsOwner(false));
      }
    }
  }, [channelName]);

  return (
    <div
      className="relative text-white right-0 flex h-full w-full"
      ref={msgContainerRef}
    >
      <div className="relative w-full">
        <div className="fixed user-card-bg border-b border-l border-gray-700 shadow-gray-700  shadow-sm left-[7.4rem] text-white p-2 right-0 flex items-center justify-between">
          <h1 className="text-xl">#{channelName.split(" ").join("-")}</h1>
          {isOwner ? (
            <RiListSettingsLine
              size="2rem"
              className="mr-2 hover:scale-110 transition duration-300 hover:text-blue-400 cursor-pointer"
            />
          ) : (
            <button
              onClick={leaveChannel}
              className="flex items-center hover:text-blue-400 cursor-pointer hover:scale-110 transition duration-300"
            >
              leave <IoMdExit size="2rem" className="ml-2" />
            </button>
          )}
        </div>
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
        {!muteMember ? (
          <MessageForm
            message={message}
            handleChange={handleChange}
            sendMessage={sendMessage}
          />
        ) : (
          <Timer />
        )}
      </div>
      <div className="h-full pt-12 px-4 my-2 w-[400px] border-l border-gray-700 user-card-bg">
        <h1 className="text-gray-300 pb-2">Members</h1>
        {channelMembers.map((member) => {
          return (
            <Member
              key={member.id}
              chId={Number(params.id)}
              {...member}
              isAdmin={isAdmin}
              isOwner={isOwner}
              channelName={channelName}
            />
          );
        })}
      </div>
    </div>
  );
};

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

const Timer = () => {
  const [timer, setTimer] = useState("");
  const [muteTime, setMuteTime] = useState(10);

  const muteTimer = (seconds: number) => {
    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);
    const countdown = setInterval(() => {
      const secondsLeft = Math.round((then - Date.now()) / 1000);
      if (secondsLeft < 0) {
        clearInterval(countdown);
        return;
      }
      displayTimeLeft(secondsLeft);
    }, 1000);
  };

  const displayTimeLeft = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    let secondsLeft = seconds % 3600;
    const minutes = Math.floor(secondsLeft / 60);
    secondsLeft = secondsLeft % 60;

    setTimer(
      `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
        secondsLeft < 10 ? "0" : ""
      }${secondsLeft}`
    );
  };

  useEffect(() => {
    muteTimer(muteTime);
  }, []);

  return (
    <div className="absolute bottom-20 flex justify-center items-center w-full h-[60px] bg-red-600">
      <p className="flex items-center font-sans">
        {" "}
        You have been muted for:
        <span className="ml-2 text-[1.5rem] font-sans">{timer}</span>
      </p>
    </div>
  );
};

export default ChannelContent;

//TODO customize the join channel form
