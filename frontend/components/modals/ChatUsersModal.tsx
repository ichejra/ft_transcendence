import { useRef, useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { User } from "../../features/userProfileSlice";
import {
  fetchChatFriend,
  setShowChatUsersModal,
  DirectMessage,
  addNewDirectMessage,
  getDirectContent,
  getDirectChatHistory,
} from "../../features/directChatslice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router";
import { socket } from "../../pages/SocketProvider";

const ChatUsersModal: React.FC = () => {
  const divRef = useRef(null);
  const dispatch = useAppDispatch();
  const { nrusers, friends, loggedUser } = useAppSelector(
    (state) => state.user
  );

  return (
    <div
      onClick={(e) => {
        if (e.target == divRef.current) dispatch(setShowChatUsersModal(false));
      }}
      className="fixed top-0 left-0 z-10 bg-black bg-opacity-75 w-full h-full"
    >
      <div
        ref={divRef}
        className="flex flex-col justify-center items-center h-full"
      >
        <div className="user-card-bg text-gray-200 overflow-auto md:h-[40rem] w-full md:w-[40rem] rounded-xl p-4">
          <div className="flex justify-between items-center mx-2 mb-10">
            <h1 className="font-medium font-sans text-3xl">Users</h1>
            <FaTimes
              size="2rem"
              className="cursor-pointer header-item transition duration-300"
              onClick={() => dispatch(setShowChatUsersModal(false))}
            />
          </div>
          {[...nrusers, ...friends]
            .filter((user) => user.id !== loggedUser.id)
            .map((user) => {
              return <NewChatUser key={user.id} {...user} />;
            })}
        </div>
      </div>
    </div>
  );
};

interface NewChatUserProps {
  id: number;
  avatar_url: string;
  user_name: string;
  display_name: string;
}
const NewChatUser: React.FC<NewChatUserProps> = ({
  id,
  avatar_url,
  display_name,
  user_name,
}) => {
  const [showSendFM, setShowSendFM] = useState(false);
  const inputMsgRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const { loggedUser } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const sendMessage = (id: number) => {
    dispatch(fetchChatFriend(id)).then(() => {
      setShowSendFM(true);
    });
  };

  const sendFirstMessage = (id: number) => {
    if (!message) return;
    console.log("--------------------- send message to", id);
    socket.emit("send_message", {
      receiverId: id,
      content: message,
    });
    const newMessage: DirectMessage = {
      id: new Date().getTime(),
      content: message,
      sender: loggedUser,
      receiver: {} as User,
      createdAt: new Date().toString(),
    };
    setMessage("");
    dispatch(addNewDirectMessage(newMessage));
    dispatch(fetchChatFriend(id)).then(() => {
      dispatch(getDirectContent(id));
      dispatch(getDirectChatHistory());
      dispatch(setShowChatUsersModal(false));
      navigate(`/direct/${id}`);
    });
  };

  useEffect(() => {
    inputMsgRef.current?.focus();
  }, [showSendFM]);

  return (
    <div
      key={id}
      className="w-full flex items-center justify-between px-2 py-3 md:px-4 border border-gray-700 my-2 rounded-md"
    >
      <div className="flex items-center space-x-10 w-full">
        <div className="flex items-center">
          <img
            src={avatar_url}
            className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full mr-2"
          />
          <div>
            <h1 className="about-family text-[12px] md:text-[14px]">
              {display_name}
            </h1>
            <h1 className="about-family text-[10px] md:text-[12px] text-gray-400">
              @{user_name}
            </h1>
          </div>
        </div>
      </div>
      {showSendFM ? (
        <form className="flex items-center justify-end w-full">
          <input
            ref={inputMsgRef}
            type="text"
            className="focus:outline-none border-blue-400 font-sans w-full px-2 py-1 text-md bg-transparent rounded-md opacity-70 md:tracking-wider border-[1px]"
            value={message}
            placeholder="New Message"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              sendFirstMessage(id);
            }}
            className={`hover:scale-105 mx-1 px-3 w-[60px] bg-blue-500 flex items-center justify-center py-1 border rounded-md hover:bg-blue-400 transition duration-300`}
          >
            send
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => sendMessage(id)}
          className="bg-blue-500 text-sm py-1 px-2 md:text-md md:py-2 md:px-6 rounded-md hover:bg-blue-400 transition duration-300"
        >
          Message
        </button>
      )}
    </div>
  );
};

export default ChatUsersModal;
