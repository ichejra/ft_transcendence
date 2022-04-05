import React, { useEffect, useState } from "react";
import { HiViewGridAdd } from "react-icons/hi";
import { SiPrivateinternetaccess } from "react-icons/si";
import { MdExplore } from "react-icons/md";
import { useParams, useNavigate, useLocation } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { socket } from "../../pages/SocketProvider";
import ChannelsList from "./ChannelsList";
import {
  updateMemmbersList,
  updateChannelContent,
} from "../../features/globalSlice";
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
  updateChannelState,
} from "../../features/chatSlice";

const ChatRooms = () => {
  const [showDirect, setShowDirect] = useState(false);
  const [showChannelContent, setShowChannelContent] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [channelId, setChannelId] = useState(-1);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { loggedUser } = useAppSelector((state) => state.user);
  const {
    channels,
    createNewChannel,
    showChannelsList,
    newChannel,
    channelState,
    channelMembers,
  } = useAppSelector((state) => state.channels);

  //* Functions_________
  //? Get selected channel content
  const getCurrentChannelContent = (id: number) => {
    dispatch(getSingleChannel(id)).then((data: any) => {
      const channel: Channel = data.payload;
      dispatch(getChannelContent(id)).then(() => {
        socket.emit("update_join", { rooms: channels, room: channel });
        dispatch(setNewChannelId({ id: newChannel.id, render: false }));
        setChannelName(channel.name);
        setChannelId(channel.id);
        dispatch(getChannelMembersList(channel.id)).then(() => {
          setShowDirect(false);
          setShowChannelContent(true);
        });
      });
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
    const loggedMember = channelMembers.find(
      (member) => member.user.id === loggedUser.id
    );
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
    socket.on("join_success", () => {
      dispatch(updateMemmbersList());
      dispatch(getChannelsList()).then(() => {
        dispatch(getChannelMembersList(channelId));
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
          setShowDirect={setShowDirect}
          setShowChannelContent={setShowChannelContent}
          getCurrentChannelContent={getCurrentChannelContent}
        />
      </div>
      {showChannelContent || showDirect ? (
        <div className="fixed h-full left-[7.5rem] right-0">
          {showChannelContent && (
            <ChannelContent channelName={channelName} channelID={channelId} />
          )}
          {showDirect && <div>Direct Direct Direct</div>}
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
