import React, { useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { HiViewGridAdd } from "react-icons/hi";
import NewChannelModal from "../modals/NewChannelModal";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setNewChannelModal } from "../../features/chatSlice";

const Channels = () => {
  const [message, setMessage] = useState("");
  const [channelId, setChannelId] = useState(0);
  const dispatch = useAppDispatch();
  const { createNewChannel } = useAppSelector((state) => state.channels);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(message);
    setMessage("");
  };

  const getChannelContent = (index: number) => {
    setChannelId(index + 1);
  };

  const createChannel = () => {
    dispatch(setNewChannelModal(true));
  };

  return (
    <div className="page-100 h-full w-full mt-20 flex about-family channels-bar-bg">
      <div className="fixed h-full overflow-auto no-scrollbar pb-20 user-card-bg border-r border-r-gray-600">
        <div>
          <div className="hover:scale-105 cursor-pointer transition duration-300 border border-blue-400 bg-transparent text-gray-200 rounded-lg w-[70px] h-[70px] flex items-center justify-center mx-6 my-3">
            Inbox
          </div>
          <hr className="mx-10" />
          {Array.from({ length: 10 }).map((item, index) => {
            return (
              <div
                onClick={() => getChannelContent(index)}
                className="hover:scale-105 cursor-pointer transition duration-300 border border-blue-400 bg-transparent text-gray-200 rounded-lg w-[70px] h-[70px] flex items-center justify-center mx-6 my-3"
              >
                ch{index + 1}
              </div>
            );
          })}
          <hr className="mx-10" />
          <div
            onClick={createChannel}
            className="hover:scale-105 cursor-pointer transition duration-300 border border-blue-400 bg-transparent text-gray-200 rounded-lg w-[70px] h-[70px] flex items-center justify-center mx-6 my-3"
          >
            <HiViewGridAdd size="3rem" />
          </div>
        </div>
      </div>
      <div className="relative text-white ml-6 left-[7.4rem]">
        <div className="fixed user-card-bg border-b border-l border-gray-700 shadow-gray-700 shadow-sm left-[7.4rem] text-white p-2 w-full">
          channel {channelId}
        </div>
        <div className="mt-12">
          {Array.from({ length: 30 }).map((item, index) => {
            return (
              <div className="my-8 mr-2 flex about-family items-center">
                <img
                  src="/images/profile.jpeg"
                  className="w-10 h-10 rounded-full mr-2"
                />
                <div>
                  <p className="text-gray-300">
                    elahyani{" "}
                    <span className="text-gray-500 text-xs">
                      {new Date().toLocaleString("default", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                  <p className="text-xs">
                    accusamus nostrum reiciendis eveniet, rem aliquid corporis
                    blanditiis itaque porro recusandae sunt. Voluptate, alias
                    sequi.
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="fixed left-[7.42rem] channels-bar-bg bottom-0 right-0">
        <form className="flex relative items-center mx-2 mb-2 px-2 pb-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="new message"
            className="w-full p-3 rounded-md user-card-bg border border-gray-700 text-gray-200 text-sm"
          />
          <button
            onClick={sendMessage}
            type="submit"
            className="absolute right-2"
          >
            <IoMdSend
              size="1.5rem"
              className="m-2 text-white hover:scale-125 transition duration-300"
            />
          </button>
        </form>
      </div>
      {createNewChannel && <NewChannelModal />}
    </div>
  );
};

export default Channels;
