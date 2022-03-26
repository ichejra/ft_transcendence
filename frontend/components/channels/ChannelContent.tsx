import React, { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useParams } from "react-router";
import { socket } from "../../pages/SocketProvider";
import { updateChannelContent } from "../../features/globalSlice";
import {
  ChannelMessage,
  getChannelMembersList,
  Member,
  addNewMessage,
  getChannelsList,
} from "../../features/chatSlice";
interface ContentProps {
  channelName: string;
}

const ChannelContent: React.FC<ContentProps> = ({ channelName }) => {
  const [message, setMessage] = useState("");
  const [isMember, setIsMember] = useState(true);
  const dispatch = useAppDispatch();
  const msgContainerRef = useRef<HTMLDivElement>(null);
  const { id: channelId } = useParams();
  const { channelContent } = useAppSelector((state) => state.channels);
  const { updateMessages } = useAppSelector((state) => state.globalState);
  const { user } = useAppSelector((state) => state.user);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    socket.emit("send_message_channel", {
      channelId,
      content: message,
      room: channelName,
    });
    setMessage("");
    window.scrollTo({
      left: 0,
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.scrollTo({
      left: 0,
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }, [updateMessages]);

  useEffect(() => {
    console.log("register");
    socket.on("receive_message_channel", (data: any) => {
      console.log("trigger the update message", data);
      console.log(data.channel?.id, "----", Number(channelId));
      dispatch(updateChannelContent());
      dispatch(addNewMessage(data));
    });
    return () => {
      console.log("unregister");
      socket.off("receive_message_channel");
    };
  }, []);

  const handleChange = (e: any) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    console.log("-->", channelId);

    dispatch(getChannelMembersList(Number(channelId))).then(
      ({ payload }: any) => {
        const checkMember = [...payload].find(
          (member: Member) => member.user.id === user.id
        );
        console.log("checkmember", checkMember);
        if (checkMember !== undefined) {
          console.log(" ------------------------------------------ member");
          setIsMember(true);
        } else {
          console.log(" ------------------------------------------ Not member");
          setIsMember(false);
        }
      }
    );
  }, [channelName]);

  return (
    <div
      className="relative text-white ml-6 left-[7.4rem]"
      ref={msgContainerRef}
    >
      <div className="fixed user-card-bg border-b border-l border-gray-700 shadow-gray-700 shadow-sm left-[7.4rem] text-white p-2 w-full">
        <h1 className="text-xl">#{channelName.split(" ").join("-")}</h1>
      </div>
      <div className="pt-10">
        {channelContent.map((message) => {
          const { id, createdAt, content, author } = message;
          return (
            <div key={id} className="my-6 mr-2 flex about-family items-center">
              <img
                src={author?.avatar_url}
                className="w-10 h-10 rounded-full mr-2"
              />
              <div>
                <p className="text-gray-300 text-lg">
                  {author?.user_name}
                  <span className="text-gray-500 text-xs mx-1">
                    {new Date(createdAt).toLocaleString("default", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </p>
                <p className="text-xs">{content}</p>
              </div>
            </div>
          );
        })}
      </div>
      <MessageForm
        message={message}
        handleChange={handleChange}
        sendMessage={sendMessage}
      />
    </div>
  );
};

interface FormProps {
  message: string;
  handleChange: (e: any) => void;
  sendMessage: (e: React.FormEvent) => void;
}

const MessageForm: React.FC<FormProps> = ({
  message,
  handleChange,
  sendMessage,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { id: channelId } = useParams();

  useEffect(() => {
    inputRef.current?.focus();
    console.log("OK");
  }, [channelId]);

  return (
    <div className="fixed left-[7.42rem] channels-bar-bg bottom-0 right-0">
      <form className="flex relative items-center mx-2 mb-2 px-2 pb-2">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => handleChange(e)}
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
  );
};

export default ChannelContent;

//TODO customize the join channel form
