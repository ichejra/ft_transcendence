import React, { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setNewChannelModal } from "../../features/chatSlice";
import { createChannel, getChannelsList } from "../../features/chatSlice";

const UsersModal: React.FC = () => {
  const divRef = useRef(null);
  const dispatch = useAppDispatch();
  const [isPrivate, setIsPrivate] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [channelPass, setChannelPass] = useState("");

  const handleRadioChange = () => {
    setIsPrivate(!isPrivate);
  };

  const submitChannelCreation = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      createChannel({
        name: channelName,
        password: channelPass,
        type: isPrivate ? "private" : "public",
      })
    ).then(() => {
      dispatch(getChannelsList());
    });
    dispatch(setNewChannelModal(false));
  };

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
          <div className="h-full">
            <div className="relative text-gray-300 h-full w-full flex flex-col items-center justify-center space-y-[2rem]">
              <h1 className=" text-xl about-title-family">Channel Info</h1>
              <form
                onSubmit={submitChannelCreation}
                className="flex flex-col items-center justify-center"
              >
                <input
                  type="text"
                  placeholder="name"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  className="text-sm m-2 p-2 w-[300px] bg-transparent border border-gray-700"
                />
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
                  className="text-sm cursor-pointer m-2 p-2 w-[300px] border border-gray-300 text-blue-900 bg-gray-300 hover:bg-white transition duration-300"
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

const RadioButton: React.FC<Radio> = ({ label, value, onChange }) => {
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

export default UsersModal;
