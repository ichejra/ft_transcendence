import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { SiPrivateinternetaccess } from "react-icons/si";
import { BsEmojiFrown } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import {
  setChannelsListModal,
  fetchUnjoinedChannels,
  getChannelsList,
  setNewChannelId,
} from "../../features/chatSlice";
import { socket } from "../../pages/SocketProvider";
import { useNavigate } from "react-router";

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
        <div className="profile-card-bg-color w-full h-full md:w-[720px] md:h-[500px] border-[1px] border-gray-700 rounded-lg">
          {unjoinedChannels.length ? (
            <div className="relative h-full overflow-auto">
              <h1 className="text-center text-white m-2 p-2 font-bold about-title-family">
                Discover new channels
              </h1>
              <div className="text-gray-300 w-full flex flex-wrap justify-center">
                {unjoinedChannels.map((channel) => {
                  return <UnjoinedChannel key={channel.id} {...channel} />;
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-full text-white opacity-20">
              <BsEmojiFrown size="10rem" />
              <h1 className="text-center text-white m-2 p-2 font-bold about-title-family">
                No Availabe Channels
              </h1>
            </div>
          )}
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

interface passError {
  message?: string;
  status?: number;
}

const UnjoinedChannel: React.FC<UCProps> = ({ id, name, type }) => {
  const inputPassRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");
  const [isBtnLoading, setIsBtnLoading] = useState(true);
  const [isValid, setIsValid] = useState(0);
  const [isPrivate, setIsPrivate] = useState(false);
  const [passwordForm, setPasswordForm] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { unjoinedChannels } = useAppSelector((state) => state.channels);

  const joinChannel = (id: number) => {
    const currentChannel = unjoinedChannels.find((ch) => ch.id === id);
    if (currentChannel) {
      if (currentChannel.type === "private") {
        setIsBtnLoading(false);
        setPasswordForm(true);
        setIsPrivate(true);
      } else {
        socket.emit("join_channel", { channelId: id });
        dispatch(getChannelsList()).then(() => {
          dispatch(setNewChannelId({ id, render: true }));
          dispatch(setChannelsListModal(false));
        });
      }
    }
  };

  const joinPrivateChannel = async (id: number) => {
    if (!password) return;
    new Promise<passError>((resolve, reject) => {
      setIsBtnLoading(true);
      socket.emit("join_channel", { channelId: id, password });
      socket.on("error", (data) => {
        reject(data);
      });
      socket.on("join_success", (data) => {
        resolve(data);
      });
    })
      .then((response) => {
        setIsBtnLoading(false);
        if (response.status === 200) {
          setIsValid(1);
          dispatch(getChannelsList()).then(() => {
            dispatch(setNewChannelId({ id, render: true }));
            dispatch(setChannelsListModal(false));
          });
          socket.off("join_success");
        }
      })
      .catch(() => {
        setIsBtnLoading(false);
        setIsValid(2);
        socket.off("error");
      });
  };

  useEffect(() => {
    inputPassRef.current?.focus();
  }, [passwordForm]);

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
          <form className="flex items-center justify-center w-full">
            <input
              ref={inputPassRef}
              type="password"
              className={`${
                isValid === 1
                  ? "focus:outline-none border-green-400"
                  : isValid === 2
                  ? "focus:outline-none border-red-400"
                  : "focus:outline-none border-blue-400"
              } about-family px-3 py-1 bg-transparent rounded-md mx-2 opacity-70 tracking-wider border-[1px]`}
              value={password}
              placeholder="Enter Password"
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              disabled={isBtnLoading}
              onClick={(e) => {
                e.preventDefault();
                joinPrivateChannel(id);
              }}
              className={`hover:scale-105 mx-1 px-3 w-[60px] bg-blue-500 flex items-center justify-center py-1 border rounded-md hover:bg-blue-400 transition duration-300`}
            >
              {isBtnLoading ? (
                <div className="loading-2 border w-6 h-6"></div>
              ) : (
                <p>Join</p>
              )}
            </button>
          </form>
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
