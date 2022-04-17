import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SiAdblock } from "react-icons/si";
import { useParams, useNavigate } from "react-router";
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
  setShowMembersList,
} from "../../features/chatSlice";

const ChatRooms = () => {
  const [showChannelContent, setShowChannelContent] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [channelID, setChannelID] = useState(-1);
  const [channelOwner, setChannelOwner] = useState({} as User);
  const [errorMsg, setErrorMsg] = useState({ status: 200, message: "ok" });
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
      if (data.error) {
        const errorCode = Number(data.payload.match(/(\d+)/)[0]);
        if (errorCode === 404) {
          navigate(`/404`, { replace: true });
        } else if (errorCode === 403) {
          setErrorMsg({ status: 403, message: "forbidden" });
        }
      } else {
        const channel: Channel = data.payload.channel;
        const owner: User = data.payload.user;
        setErrorMsg({ status: 200, message: "ok" });
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
        dispatch(setShowMembersList(false));
        navigate(`/channels/${id}`);
      }
    });
  };

  //* Effects__________
  useEffect(() => {
    if (Number(params.id)) {
      getCurrentChannelContent(Number(params.id));
    } else {
      dispatch(getChannelsList());
    }
  }, [params.id]);

  useEffect(() => {
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
      if (data.removeChannel) {
        navigate("/channels");
        dispatch(getChannelsList()).then(() => {
          setShowChannelContent(false);
        });
      } else {
        getCurrentChannelContent(data.channelId);
      }
    });
    socket.on("join_success", (data) => {
      dispatch(updateMemmbersList());
      dispatch(getChannelsList()).then(() => {
        dispatch(getChannelMembersList(data.channelId));
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

  if (errorMsg.status === 403) {
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
    <div className="relative page-100 h-full w-full pt-20 pb-16 about-family channels-bar-bg">
      <div className="fixed h-full overflow-auto no-scrollbar pb-20 user-card-bg border-r border-r-gray-600">
        <ChannelsList
          setShowChannelContent={setShowChannelContent}
          getCurrentChannelContent={getCurrentChannelContent}
        />
      </div>
      {showChannelContent && params.id ? (
        <div className="fixed h-full left-[4.2rem] md:left-[7.5rem] right-0">
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
