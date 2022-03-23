import React, { useEffect, useState } from "react";
import { HiViewGridAdd } from "react-icons/hi";
import { SiPrivateinternetaccess } from "react-icons/si";
import NewChannelModal from "../modals/NewChannelModal";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  setNewChannelModal,
  getChannelsList,
  getSingleChannel,
  getChannelContent,
  setStaticMessages,
  ChannelMessage,
} from "../../features/chatSlice";
import { useNavigate, useParams } from "react-router";
import DirectChat from "./DirectChat";
import ChannelContent from "./ChannelContent";
import { socket } from "../../pages/SocketProvider";
import { updateChannelContent } from "../../features/globalSlice";

const ChatRooms = () => {
  const [showDirect, setShowDirect] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [showChannelContent, setShowChannelContent] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id: channelId } = useParams();
  const { createNewChannel, channels } = useAppSelector(
    (state) => state.channels
  );

  const getChannelMessages = (id: number) => {
    setShowDirect(false);
    setShowChannelContent(true);
    dispatch(getSingleChannel(id)).then(({ payload }: any) => {
      dispatch(getChannelContent(payload.id)).then(() => {
        window.scrollTo({
          left: 0,
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      });
      setChannelName(payload.name);
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
    socket.on("receive_message_channel", (data: ChannelMessage) => {
      console.log("trigger the update message", data);
      dispatch(updateChannelContent());
      dispatch(setStaticMessages(data));
    });
  }, [socket]);

  useEffect(() => {
    dispatch(getChannelsList());
  }, []);

  return (
    <div className="page-100 h-full w-full pt-20 pb-16 flex about-family channels-bar-bg">
      <div className="fixed h-full overflow-auto no-scrollbar pb-20 user-card-bg border-r border-r-gray-600">
        <div>
          <div
            onClick={getDirectMessages}
            className={`hover:scale-105 ${
              !Number(channelId) && "highlight"
            } cursor-pointer transition duration-300 border border-blue-400 bg-transparent text-gray-200 rounded-lg w-[70px] h-[70px] flex items-center justify-center mx-6 my-3`}
          >
            Inbox
          </div>
          <hr className="mx-10" />
          {channels.map((channel) => {
            const { id, name, type } = channel;
            return (
              <div
                key={id}
                onClick={() => getChannelMessages(id)}
                className={`hover:scale-105 ${
                  id === Number(channelId) && "highlight"
                } relative cursor-pointer transition duration-300 border border-blue-400 bg-transparent text-gray-200 rounded-xl w-[70px] h-[70px] flex items-center justify-center mx-6 my-3`}
              >
                {type === "private" && (
                  <div className='absolute -top-[8px] -right-[8px]'>
                    <SiPrivateinternetaccess size='1.3rem' className='text-blue-400' />
                  </div>
                )}
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
      {(showDirect || !Number(channelId)) && <DirectChat />}
      {showChannelContent && <ChannelContent channelName={channelName} />}
      {createNewChannel && <NewChannelModal />}
    </div>
  );
};

export default ChatRooms;
