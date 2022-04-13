import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { FaTimes } from "react-icons/fa";
import {
  createChannel,
  getChannelsList,
  setNewChannelModal,
  Channel,
  setNewChannelId,
} from "../../features/chatSlice";
import { socket } from "../../pages/SocketProvider";

const NewChannelModal: React.FC = () => {
  const divRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const [isPrivate, setIsPrivate] = useState(false);
  const [isValid, setIsValid] = useState(0);
  const [channelName, setChannelName] = useState("");
  const [channelPass, setChannelPass] = useState("");
  const { error } = useAppSelector((state) => state.channels);

  const handleRadioChange = () => {
    setIsPrivate(!isPrivate);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submitChannelCreation = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid !== 1) return;
    dispatch(
      createChannel({
        name: channelName,
        password: channelPass,
        type: isPrivate ? "private" : "public",
      })
    ).then((data: any) => {
      if (data.error) {
        console.log("________> Rejected");
        setIsValid(3);
      } else {
        const newChannel: Channel = data.payload.channel;
        socket.emit("create_channel", { room: newChannel.name });
        dispatch(getChannelsList()).then(() => {
          dispatch(setNewChannelId({ id: newChannel.id, render: true }));
          dispatch(setNewChannelModal(false));
        });
      }
    });
  };

  useEffect(() => {
    const channelNameRegex = /^[a-zA-Z0-9 ]{6,}$/i;
    const channelPassRegex = /^.{6,}$/i;
    setIsValid(() => {
      if (!channelName || (isPrivate && !channelPass)) {
        return 0;
      }
      return !channelNameRegex.test(channelName) ||
        (isPrivate && !channelPassRegex.test(channelPass))
        ? 0
        : 1;
    });
  }, [channelName, channelPass, isPrivate]);

  return (
    <div
      onClick={(e) => {
        if (e.target == divRef.current) {
          dispatch(setNewChannelModal(false));
        }
      }}
      className="fixed top-0 left-0 z-10 bg-black bg-opacity-75 w-full h-full"
    >
      <div
        ref={divRef}
        className="flex flex-col justify-center items-center h-full"
      >
        <div className="profile-card-bg-color w-full h-full md:w-[700px] md:h-[500px] border-[1px] border-gray-700">
          <div className="relative h-full">
            <FaTimes
              size="2rem"
              onClick={() => dispatch(setNewChannelModal(false))}
              className="absolute z-10 text-white right-0 m-2 hover:text-blue-400 transition duration-300 cursor-pointer top-20 md:top-0"
            />
            <div className="relative text-gray-300 h-full w-full flex flex-col items-center justify-center space-y-[2rem]">
              <h1 className=" text-xl about-title-family">New Channel</h1>
              <form
                onSubmit={submitChannelCreation}
                className="flex flex-col items-center justify-center"
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="name"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  className="text-sm m-2 p-2 w-[300px] bg-transparent border border-gray-700"
                />
                <p className="font-sans w-full ml-3 text-xs text-red-500">
                  {isValid === 3 && error.status === 403 && error.message}
                </p>
                <div className="w-full px-2 flex justify-start items-center">
                  <RadioButton
                    label="Public"
                    value={!isPrivate}
                    onChange={handleRadioChange}
                  />
                  <RadioButton
                    label="Private"
                    value={isPrivate}
                    onChange={handleRadioChange}
                  />
                </div>
                {isPrivate && (
                  <input
                    type="password"
                    placeholder="password"
                    value={channelPass}
                    onChange={(e) => setChannelPass(e.target.value)}
                    className="text-sm m-2 p-2 w-[300px] bg-transparent border border-gray-700"
                  />
                )}
                <input
                  type="submit"
                  placeholder="Channel name"
                  className={`${
                    isValid === 1
                      ? "cursor-pointer hover:bg-white transition duration-300"
                      : "opacity-40 cursor-not-allowed"
                  } text-sm m-2 p-2 w-[300px] border border-gray-300 text-blue-900 bg-gray-300 `}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Radio {
  label: string;
  value: boolean;
  onChange: () => void;
}

export const RadioButton: React.FC<Radio> = ({ label, value, onChange }) => {
  return (
    <label>
      <input
        type="radio"
        checked={value}
        onChange={onChange}
        className="text-sm m-2 p-2  bg-transparent border border-gray-700"
      />
      {label}
    </label>
  );
};

export default NewChannelModal;
