import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { IoMdSend } from "react-icons/io";
import { SiAdblock } from "react-icons/si";
import { GoPrimitiveDot } from "react-icons/go";
import { BiConversation } from "react-icons/bi";
import { MdAdd } from "react-icons/md";
import { AiFillWechat } from "react-icons/ai";
import { BsChatLeftDots } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getDirectContent,
  setShowChatUsersModal,
  getDirectChatHistory,
  fetchChatFriend,
  addNewDirectMessage,
  DirectMessage,
  setShowChatUsersHistory,
} from "../../features/directChatslice";
import { User } from "../../features/userProfileSlice";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import { setUpdateDirectMessages } from "../../features/globalSlice";
import ChatUsersModal from "../modals/ChatUsersModal";
import { socket } from "../../pages/SocketProvider";

const DirectChat = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState({ status: 200, message: "OK" });
  const messagesDivRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { loggedUser } = useAppSelector((state) => state.user);
  const {
    showChatUsersModal,
    chatFriend,
    directMessages,
    directChatUsersHistory,
    showChatUsersHistory,
  } = useAppSelector((state) => state.directChat);
  const { updateDirectMessages, refresh } = useAppSelector(
    (state) => state.globalState
  );

  const getDirectMessages = (id: number) => {
    dispatch(fetchChatFriend(id)).then(() => {
      dispatch(getDirectContent(id)).then((data: any) => {
        if (data.error) {
          setError({ status: 403, message: "Forbidden" });
        } else {
          setError({ status: 200, message: "OK" });
          dispatch(setShowChatUsersHistory(false));
          navigate(`/direct/${id}`);
        }
      });
    });
  };

  const handleChange = (e: any) => {
    const value = e.target.value;
    if (value.length > 200) return;
    setMessage(e.target.value);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    socket.emit("send_message", {
      receiverId: Number(params.id),
      content: message,
    });
    const newMessage: DirectMessage = {
      id: new Date().getTime(),
      content: message,
      sender: loggedUser,
      receiver: chatFriend,
      createdAt: new Date().toString(),
    };
    dispatch(addNewDirectMessage(newMessage));
    setMessage("");
    messagesDivRef.current?.scrollTo({
      left: 0,
      top: messagesDivRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (Cookies.get("accessToken")) {
      dispatch(getDirectChatHistory());
      if (Number(params.id)) {
        getDirectMessages(Number(params.id));
      }
    }
  }, [params.id]);

  useEffect(() => {
    if (Cookies.get("accessToken")) {
      dispatch(getDirectChatHistory());
      if (Number(params.id)) {
        navigate("/direct");
      }
    }
  }, [refresh]);

  useEffect(() => {
    messagesDivRef.current?.scrollTo({
      left: 0,
      top: messagesDivRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [updateDirectMessages]);

  useEffect(() => {
    socket.on("receive_message", (data: DirectMessage) => {
      if (data.sender.id === Number(params.id)) {
        dispatch(getDirectChatHistory()).then(() => {
          dispatch(setUpdateDirectMessages());
          dispatch(addNewDirectMessage(data));
        });
      }
      dispatch(getDirectChatHistory());
    });
    return () => {
      socket.off("receive_message");
    };
  }, [params.id]);

  if (error.status === 403) {
    return (
      <div className="page-100 mt-20 flex justify-center bg-black">
        <div className="flex flex-col w-full text-gray-300 2xl:w-[80rem] items-center justify-center shadow-xl rounded-none lg:rounded-xl">
          <SiAdblock size="18rem" className="p-6 m-2" />
          <p className="about-title-family">
            This page is not accessible right now
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
    <div className="fixed z-10 right-0 bottom-0 h-full overflow-auto no-scrollbar pt-20 channels-bar-bg text-gray-300 about-family left-0">
      <div className="relative w-full h-full flex">
        <div className="w-[24rem] hidden md:block user-card-bg border-r border-r-gray-600 h-full">
          <ChatUsersHistory
            getDirectMessages={getDirectMessages}
            directChatUsersHistory={directChatUsersHistory}
          />
        </div>
        {showChatUsersHistory && (
          <div className="block md:hidden absolute z-10 w-4/6  user-card-bg border-r border-r-gray-600 h-full">
            <ChatUsersHistory
              getDirectMessages={getDirectMessages}
              directChatUsersHistory={directChatUsersHistory}
            />
          </div>
        )}
        <BiConversation
          size="3rem"
          onClick={() =>
            dispatch(setShowChatUsersHistory(!showChatUsersHistory))
          }
          className="absolute md:hidden right-2 z-10 top-12 text-gray-300 rounded-full border p-1 bg-blue-600 hover:bg-white hover:bg-opacity-25 cursor-pointer transition duration-300"
        />
        {Number(params.id) ? (
          <div className="relative right-0 w-full">
            <div className="absolute user-card-bg border-b border-l border-gray-700 shadow-gray-700  shadow-sm text-white p-2 right-0 w-full">
              <h1>@ {chatFriend.user_name}</h1>
            </div>
            <div
              ref={messagesDivRef}
              className="mx-6 pt-10 pb-32 h-full channels-bar-bg overflow-auto no-scrollbar"
            >
              {directMessages.map((message) => {
                const { id, content, sender, createdAt } = message;
                return (
                  <div
                    key={id}
                    className="my-6 mr-2 flex about-family items-start"
                  >
                    <img
                      src={sender.avatar_url}
                      alt={sender.user_name}
                      className="w-10 h-10 rounded-full mr-2"
                    />
                    <div>
                      <p
                        className={`text-gray-300 text-sm font-bold font-sans ${
                          sender.id === loggedUser.id
                            ? "text-cyan-300"
                            : "text-yellow-200"
                        }`}
                      >
                        {sender.user_name}
                        <span className=" text-gray-500 text-[8px] md:text-xs mx-1">
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
            <MessageForm
              message={message}
              handleChange={handleChange}
              sendMessage={sendMessage}
            />
          </div>
        ) : (
          <div className="relative right-0 w-full flex m-auto">
            <div className="w-full flex items-center right-0 justify-center">
              <AiFillWechat size="10rem" className="text-gray-400" />
            </div>
          </div>
        )}
      </div>
      {showChatUsersModal && <ChatUsersModal />}
    </div>
  );
};

interface ChatUsersHistoryProps {
  directChatUsersHistory: User[];
  getDirectMessages: (id: number) => void;
}

const ChatUsersHistory: React.FC<ChatUsersHistoryProps> = ({
  directChatUsersHistory,
  getDirectMessages,
}) => {
  const dispatch = useAppDispatch();
  const params = useParams();

  return (
    <>
      <h1 className="border-b-2 user-card-bg border-b-gray-700 p-2 flex justify-between">
        Direct Messages
        <MdAdd
          size="1.5rem"
          onClick={() => dispatch(setShowChatUsersModal(true))}
          className="text-gray-300 rounded-full hover:bg-white hover:bg-opacity-25 cursor-pointer transition duration-300"
        />
      </h1>
      <div className="">
        {directChatUsersHistory.length ? (
          directChatUsersHistory.map((user) => {
            const { id, avatar_url, user_name, display_name } = user;
            return (
              <div
                key={id}
                onClick={() => getDirectMessages(id)}
                className={`${
                  id === Number(params.id) && "highlight"
                } hover:bg-gray-800 cursor-pointer transition duration-300 bg-transparent text-gray-200 flex items-center p-2`}
              >
                <div className="relative">
                  {user.state === "online" ? (
                    <GoPrimitiveDot
                      size="1.3rem"
                      className="absolute text-green-400 right-[1px] -bottom-[2px]"
                    />
                  ) : user.state === "in_game" ? (
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
                    src={avatar_url}
                    alt={user_name}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-2"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-gray-300 text-lg">{user_name}</p>
                  <p className="text-xs font-sans text-gray-400">
                    {user.state}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="mt-10 w-full flex justify-center">
            <BsChatLeftDots size="3rem" className="text-gray-400" />
          </div>
        )}
      </div>
    </>
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
    <div className="absolute channels-bar-bg bottom-0 w-full">
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

export default DirectChat;
