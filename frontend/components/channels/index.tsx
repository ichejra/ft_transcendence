import React, { useEffect, useState } from "react";

import NewChannelModal from "../modals/NewChannelModal";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getChannelsList,
  getSingleChannel,
  getChannelContent,
  setNewChannelId,
  getChannelMembersList,
} from "../../features/chatSlice";
import { useNavigate, useLocation } from "react-router";
import DirectChat from "./DirectChat";
import ChannelContent from "./ChannelContent";
import ChannelsListModal from "../modals/ChannelsListModal";
import { socket } from "../../pages/SocketProvider";
import { updateMemmbersList } from "../../features/globalSlice";
import ChannelsList from "./ChannelsList";

const ChatRooms = () => {
  const [showDirect, setShowDirect] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [channelID, setChannelID] = useState(-1);
  const [showChannelContent, setShowChannelContent] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const {
    createNewChannel,
    showChannelsList,
    channels,
    newChannel,
    channelState,
  } = useAppSelector((state) => state.channels);

  const getSelectedChannel = (id: number) => {
    dispatch(getSingleChannel(id)).then(({ payload }: any) => {
      dispatch(getChannelContent(payload.id)).then(() => {
        socket.emit("update_join", { rooms: channels, room: payload });
        dispatch(getChannelMembersList(payload.id));
        setChannelName(payload.name);
        setChannelID(payload.id);
        setShowChannelContent(true);
        dispatch(setNewChannelId(payload.id));
        navigate(`/channels/${id}`);
      });
    });
  };

  useEffect(() => {
    socket.on("join_success", () => {
      dispatch(updateMemmbersList());
    });
    return () => {
      socket.off("join_success");
    };
  }, []);

  useEffect(() => {
    console.log("NEW CHANNEL ID ==>==>==>==>>>>>", pathname, newChannel);
    if (newChannel.id !== -1 && newChannel.render) {
      getSelectedChannel(newChannel.id);
    }
  }, [newChannel]);

  useEffect(() => {
    console.log("Update channel state");
    dispatch(getChannelsList()).then(() => {
      setShowChannelContent(false);
    });
  }, [channelState]);

  return (
    <div className="relative page-100 h-full w-full pt-20 pb-16 about-family channels-bar-bg">
      <div className="fixed h-full overflow-auto no-scrollbar pb-20 user-card-bg border-r border-r-gray-600">
        <ChannelsList
          getSelectedChannel={getSelectedChannel}
          setShowChannelContent={setShowChannelContent}
          setShowDirect={setShowDirect}
        />
      </div>
      {showChannelContent || showDirect ? (
        <div className="fixed h-full left-[7.5rem] right-0">
          {showChannelContent && (
            <ChannelContent channelName={channelName} channelID={channelID} />
          )}
          {showDirect && <DirectChat />}
        </div>
      ) : (
        <div className="relative text-white left-[7.5rem]">
          <div className="fixed left-[7.5rem] right-0 h-full bottom-0 channels-bar-bg text-white flex items-center justify-center">
            <h1 className="text-[1.3rem] w-[25rem] text-center text-white opacity-40 about-title-family">
              Join a channel and start chatting
            </h1>
          </div>
        </div>
      )}
      {createNewChannel && <NewChannelModal />}
      {showChannelsList && <ChannelsListModal />}
    </div>
  );
};

export default ChatRooms;
