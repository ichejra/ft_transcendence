import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { SiPrivateinternetaccess } from "react-icons/si";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  setChannelsListModal,
  fetchUnjoinedChannels,
  getChannelsList,
  getChannelContent,
  addNewChannel,
} from "../../features/chatSlice";
import { socket } from "../../pages/SocketProvider";

const ChannelsListModal = () => {
  const divRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();
  const { unjoinedChannels } = useAppSelector((state) => state.channels);

  useEffect(() => {
    dispatch(fetchUnjoinedChannels()).then(() => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div>
        <div
          onClick={(e) => {
            if (e.target == divRef.current) {
              dispatch(setChannelsListModal(false));
            }
          }}
          className="fixed top-0 left-0 z-10 bg-black bg-opacity-75 w-full h-full"
        >
          <div
            ref={divRef}
            className="flex flex-col justify-center items-center h-full"
          >
            <div className="profile-card-bg-color w-full h-full md:w-[700px] md:h-[500px] border-[1px] border-gray-700">
              <div className="loading w-24 h-24"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      onClick={(e) => {
        if (e.target == divRef.current) {
          dispatch(setChannelsListModal(false));
        }
      }}
      className="fixed top-0 left-0 z-10 bg-black bg-opacity-75 w-full h-full"
    >
      <div
        ref={divRef}
        className="flex flex-col justify-center items-center h-full"
      >
        <div className="profile-card-bg-color w-full h-full md:w-[700px] md:h-[500px] border-[1px] border-gray-700">
          <div className="h-full">
            <div className="relative text-gray-300 w-full flex flex-wrap">
              {unjoinedChannels.map((channel) => {
                return <UnjoinedChannel key={channel.id} {...channel} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface UCProps {
  id: number;
  name: string;
  type: string;
}

const UnjoinedChannel: React.FC<UCProps> = ({ id, name, type }) => {
  const inputPassRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [passwordForm, setPasswordForm] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { unjoinedChannels } = useAppSelector((state) => state.channels);

  const joinChannel = (id: number) => {
    const currentChannel = unjoinedChannels.find((ch) => ch.id === id);
    if (currentChannel) {
      if (currentChannel.type === "private") {
        setPasswordForm(true);
        setIsPrivate(true);
        inputPassRef.current?.focus();
      } else {
        socket.emit("join_channel", { channelId: id });
        dispatch(getChannelsList()).then(() => {
          dispatch(addNewChannel());
          navigate(`/channels/${id}`);
          dispatch(setChannelsListModal(false));
          //   dispatch(getChannelContent(id)).then(() => {
          //   });
        });
        console.log("joined");
      }
    }
  };

  const joinPrivateChannel = (id: number) => {
    console.log("joined");
    if (password) {
      socket.emit("join_channel", { channelId: id, password });
    }
  };

  return (
    <div>
      <div
        className={`relative transition duration-300 border border-blue-400 bg-transparent text-gray-200 rounded-xl w-[320px] h-[90px] flex items-center justify-between mx-3 my-3`}
      >
        {type === "private" && (
          <div className="absolute -top-[8px] -right-[8px]">
            <SiPrivateinternetaccess size="1.3rem" className="text-blue-400" />
          </div>
        )}
        {passwordForm && isPrivate ? (
          <div className="flex items-center justify-center w-full">
            <input
              ref={inputPassRef}
              type="password"
              className={`about-family px-4 py-2 focus:outline-none bg-transparent rounded-md m-2 border-gray-400 opacity-70 tracking-wider border-[1px]`}
              maxLength={12}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              onClick={() => joinPrivateChannel(id)}
              className="hover:scale-105 mx-1 px-3 w-[60px] bg-blue-500 flex items-center justify-center h-[2.5rem] rounded-md hover:bg-blue-400 transition duration-300"
            >
              Join
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full px-6">
            <h1>{name}</h1>
            <button
              key={id}
              onClick={() => joinChannel(id)}
              className="hover:scale-105 mx-2 px-6 bg-blue-500 flex items-center justify-center h-[2.5rem] rounded-md hover:bg-blue-400 transition duration-300"
            >
              Join
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelsListModal;
