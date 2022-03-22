import React, { useEffect, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { HiViewGridAdd } from "react-icons/hi";
import NewChannelModal from "../modals/NewChannelModal";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  setNewChannelModal,
  getChannelsList,
  getSingleChannel,
  getChannelContent,
  getDirectContent,
} from "../../features/chatSlice";
import { useNavigate, useParams } from "react-router";
import { socket } from "../../pages/SocketProvider";

const Channels = () => {
  const [message, setMessage] = useState("");
  const [showDirect, setShowDirect] = useState(false);
  const dispatch = useAppDispatch();
  const { id: channelId } = useParams();
  const navigate = useNavigate();
  const { createNewChannel, channels, channel, channelContent } =
    useAppSelector((state) => state.channels);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    console.log(message);
    setMessage("");
    socket.emit("send_message_channel", { content: message });
  };

  const getChannelMessages = (id: number) => {
    setShowDirect(false);
    dispatch(getSingleChannel(id)).then(({ payload }: any) => {
      dispatch(getChannelContent(payload.id));
    });
    navigate(`/channels/${id}`);
  };

  const getDirectMessages = () => {
    setShowDirect(true);
    navigate(`/channels/direct`);
  };

  const createChannel = () => {
    dispatch(setNewChannelModal(true));
  };

  useEffect(() => {
    dispatch(getChannelsList());
  }, []);

  useEffect(() => {
    dispatch(getSingleChannel(Number(channelId)));
  }, []);

  return (
    <div className="page-100 h-full w-full mt-20 flex about-family channels-bar-bg">
      <div className="fixed h-full overflow-auto no-scrollbar pb-20 user-card-bg border-r border-r-gray-600">
        <div>
          <div
            onClick={getDirectMessages}
            className="hover:scale-105 cursor-pointer transition duration-300 border border-blue-400 bg-transparent text-gray-200 rounded-lg w-[70px] h-[70px] flex items-center justify-center mx-6 my-3"
          >
            Inbox
          </div>
          <hr className="mx-10" />
          {channels.map((channel) => {
            const { id, name } = channel;
            return (
              <div
                key={id}
                onClick={() => getChannelMessages(id)}
                className="hover:scale-105 cursor-pointer transition duration-300 border border-blue-400 bg-transparent text-gray-200 rounded-xl w-[70px] h-[70px] flex items-center justify-center mx-6 my-3"
              >
                {name.split(" ").length >= 2
                  ? name.split(" ")[0][0].toUpperCase() +
                    name.split(" ")[1][0].toUpperCase()
                  : name.substring(0, 2).toUpperCase()}
              </div>
            );
          })}
          <div
            onClick={createChannel}
            className="hover:scale-105 cursor-pointer transition duration-300 border border-blue-400 bg-transparent text-gray-200 rounded-lg w-[70px] h-[70px] flex items-center justify-center mx-6 my-3"
          >
            <HiViewGridAdd size="3rem" />
          </div>
        </div>
      </div>
      {showDirect && <DirectMessagesContainer />}
      <div className="relative text-white ml-6 left-[7.4rem]">
        <div className="fixed user-card-bg border-b border-l border-gray-700 shadow-gray-700 shadow-sm left-[7.4rem] text-white p-2 w-full">
          <h1 className="text-xl">#{channel.name.split(" ").join("-")}</h1>
        </div>
        <div className="mt-16">
          {channelContent.map((message) => {
            const { id, author, content, createdAt } = message;
            return (
              <div
                key={id}
                className="my-8 mr-2 flex about-family items-center"
              >
                <img
                  src="/images/profile.jpeg"
                  className="w-10 h-10 rounded-full mr-2"
                />
                <div>
                  <p className="text-gray-300">
                    {author.user_name}{" "}
                    <span className="text-gray-500 text-xs">
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
                  <p className="text-xs">{content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="fixed left-[7.42rem] channels-bar-bg bottom-0 right-0">
        <form className="flex relative items-center mx-2 mb-2 px-2 pb-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="new message"
            className="w-full p-3 rounded-md user-card-bg border border-gray-700 text-gray-200 text-sm"
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
      {createNewChannel && <NewChannelModal />}
    </div>
  );
};

const DirectMessagesContainer = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const getDirectMessages = () => {
    dispatch(getDirectContent(1));
    navigate(`/channels/direct/${1}`);
  };
  return (
    <div className="fixed z-10 w-[20rem] h-full overflow-auto no-scrollbar text-gray-300 pb-24 user-card-bg border-r border-r-gray-600 left-[7.5rem]">
      <h1 className="m-2 p-2">Direct Messages</h1>
      {Array.from({ length: 50 }).map((item, index) => {
        return (
          <div
            key={index}
            onClick={getDirectMessages}
            className="hover:bg-gray-800 cursor-pointer transition duration-300 bg-transparent text-gray-200 rounded-xl h-[60px] flex items-center m-2 p-2"
          >
            <img
              src="/images/profile.jpeg"
              className="w-12 h-12 rounded-full mr-2"
            />
            <h1>elahyani {index}</h1>
          </div>
        );
      })}
      <div className="flex justify-center">
        <hr className="w-14 h-[2px] border-none my-2 bg-gray-500" />
      </div>
    </div>
  );
};

export default Channels;
