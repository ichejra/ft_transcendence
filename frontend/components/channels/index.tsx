import React, { useEffect, useState } from "react";
import { HiViewGridAdd } from "react-icons/hi";
import { SiPrivateinternetaccess } from "react-icons/si";
import { MdExplore } from "react-icons/md";
import NewChannelModal from "../modals/NewChannelModal";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  setNewChannelModal,
  getChannelsList,
  getSingleChannel,
  getChannelContent,
  setChannelsListModal,
} from "../../features/chatSlice";
import { useNavigate, useParams, useLocation } from "react-router";
import DirectChat from "./DirectChat";
import ChannelContent from "./ChannelContent";
import ChannelsListModal from "../modals/ChannelsListModal";
import { socket } from "../../pages/SocketProvider";

const ChatRooms = () => {
  const [showDirect, setShowDirect] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [addChannel, setAddChannel] = useState(false);
  const [showChannelContent, setShowChannelContent] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const { id: channelId } = useParams();
  const { createNewChannel, showChannelsList, channels } = useAppSelector(
    (state) => state.channels
  );

  const getChannelMessages = (id: number) => {
    setShowDirect(false);
    setShowChannelContent(true);
    dispatch(setChannelsListModal(false));
    dispatch(getSingleChannel(id)).then(({ payload }: any) => {
      dispatch(getChannelContent(payload.id)).then(() => {
        window.scrollTo({
          left: 0,
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      });
      socket.emit("update_join", { rooms: channels, room: payload });
      setChannelName(payload.name);
    });
    navigate(`/channels/${id}`);
  };

  const getDirectMessages = () => {
    setShowDirect(true);
    setShowChannelContent(false);
    navigate(`/channels/direct`);
  };

  const createChannel = () => {
    dispatch(setNewChannelModal(true));
  };

  const exploreChannels = () => {
    dispatch(setChannelsListModal(true));
  };

  useEffect(() => {
    dispatch(getChannelsList());
  }, [addChannel]);

  return (
    <div className="page-100 h-full w-full pt-20 pb-16 flex about-family channels-bar-bg">
      <div className="fixed h-full overflow-auto no-scrollbar pb-20 user-card-bg border-r border-r-gray-600">
        <div>
          <div
            onClick={getDirectMessages}
            className={`hover:scale-105 ${
              pathname === "/channels/direct" && "highlight"
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
                  <div className="absolute -top-[8px] -right-[8px]">
                    <SiPrivateinternetaccess
                      size="1.3rem"
                      className="text-blue-400"
                    />
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
          <div
            onClick={exploreChannels}
            className="hover:scale-105 cursor-pointer transition duration-300 border border-blue-400 bg-transparent text-gray-200 rounded-lg w-[70px] h-[70px] flex items-center justify-center mx-6 my-3"
          >
            <MdExplore size="3rem" />
          </div>
        </div>
      </div>
      {showChannelContent || showDirect ? (
        <div>
          {showChannelContent && (
            <ChannelContent
              setAddChannel={setAddChannel}
              addChannel={addChannel}
              channelName={channelName}
            />
          )}
          {showDirect && <DirectChat />}
        </div>
      ) : (
        <div className="relative text-white left-[7.5rem]">
          <div className="fixed w-full h-full bottom-0 channels-bar-bg text-white flex items-center justify-center">
            <h1 className="text-[1.3rem] w-[25rem] text-center text-white opacity-40 about-title-family">
              Join a channel and start chatting
            </h1>
          </div>
        </div>
      )}
      {createNewChannel && (
        <NewChannelModal
          setAddChannel={setAddChannel}
          addChannel={addChannel}
        />
      )}
      {showChannelsList && (
        <ChannelsListModal getChannelMessages={getChannelMessages} />
      )}
    </div>
  );
};

export default ChatRooms;
