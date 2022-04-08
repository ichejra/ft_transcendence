import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { socket } from "../../pages/SocketProvider";
import ChannelsList from "./ChannelsList";
import {
  updateMemmbersList,
  updateChannelContent,
} from "../../features/globalSlice";
import { User } from "../../features/userProfileSlice";
import ChannelContent from "./ChannelContent";
import NewChannelModal from "../modals/NewChannelModal";
import ChannelsListModal from "../modals/ChannelsListModal";
import {
  Channel,
  getChannelContent,
  getChannelMembersList,
  getChannelsList,
  getSingleChannel,
  setNewChannelId,
  addNewMessage,
  getLoggedUserRole,
} from "../../features/chatSlice";

const ChatRooms = () => {
  const [showChannelContent, setShowChannelContent] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [channelID, setChannelID] = useState(-1);
  const [channelOwner, setChannelOwner] = useState({} as User);
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useAppDispatch();
  const {
    channels,
    createNewChannel,
    showChannelsList,
    newChannel,
    channelState,
  } = useAppSelector((state) => state.channels);

  //* Functions_________
  //? Get selected channel content
  const getCurrentChannelContent = (id: number) => {
    dispatch(getSingleChannel(id)).then((data: any) => {
      const channel: Channel = data.payload.channel;
      const owner: User = data.payload.user;
      dispatch(getChannelContent(id)).then(() => {
        socket.emit("update_join", { rooms: channels, room: channel });
        dispatch(setNewChannelId({ id: newChannel.id, render: false }));
        setChannelName(channel.name);
        setChannelOwner(owner);
        setChannelID(channel.id);
        dispatch(getChannelMembersList(channel.id)).then(() => {
          setShowChannelContent(true);
        });
      });
      dispatch(getLoggedUserRole(id));
    });
    navigate(`/channels/${id}`);
  };

  //* Effects__________
  useEffect(() => {
    console.log("%c[Index] get channels list", "color:blue");
    if (Number(params.id)) {
      getCurrentChannelContent(Number(params.id));
    } else {
      dispatch(getChannelsList());
    }
  }, []);

  useEffect(() => {
    console.log(
      "%c[Index] get new joined channel content",
      "color:green",
      newChannel.id
    );
    if (newChannel.render) {
      getCurrentChannelContent(newChannel.id);
    }
  }, [newChannel.id]);

  useEffect(() => {
    dispatch(getChannelsList()).then(() => {
      setShowChannelContent(false);
    });
  }, [channelState]);

  useEffect(() => {
    socket.on("leave_success", (data) => {
      //TODO send the userRole of the user left the channel
      /* if (data.userRole === 'owner') {
        navigate("/channels");
        dispatch(getChannelsList()).then(() => {
          setShowChannelContent(false);
        });
      } */
      dispatch(getChannelMembersList(data.channelId));
      console.log("%cleaved the channel", "color:red");
    });
    socket.on("join_success", (data) => {
      console.log("join_success");
      dispatch(updateMemmbersList());
      dispatch(getChannelsList()).then(() => {
        if (channelID !== -1) {
          console.log("join_success: ", data.channelId, channelID);
          dispatch(getChannelMembersList(data.channelId));
        }
      });
    });
    socket.on("receive_message_channel", (data: any) => {
      dispatch(updateChannelContent());
      dispatch(addNewMessage(data));
    });
    return () => {
      socket.off("join_success");
      socket.off("leave_success");
      socket.off("receive_message_channel");
    };
  }, []);

  return (
    <div className="relative page-100 h-full w-full pt-20 pb-16 about-family channels-bar-bg">
      <div className="fixed h-full overflow-auto no-scrollbar pb-20 user-card-bg border-r border-r-gray-600">
        <ChannelsList
          setShowChannelContent={setShowChannelContent}
          getCurrentChannelContent={getCurrentChannelContent}
        />
      </div>
      {showChannelContent && params.id ? (
        <div className="fixed h-full left-[7.5rem] right-0">
          {showChannelContent && (
            <ChannelContent
              channelName={channelName}
              currentChannelID={channelID}
              channelOwner={channelOwner}
            />
          )}
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
