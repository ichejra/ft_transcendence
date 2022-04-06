import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getDirectContent } from "../../features/chatSlice";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import { fetchUserFriends } from "../../features/userProfileSlice";

const DirectChat = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { friends } = useAppSelector((state) => state.user);

  const getDirectMessages = (id: number) => {
    dispatch(getDirectContent(id));
    navigate(`/channels/direct/${id}`);
  };

  useEffect(() => {
    if (Cookies.get("accessToken")) {
      dispatch(fetchUserFriends());
    }
    console.log("s7aaaabiiii", friends);
  }, []);

  return (
    <div className="fixed z-10 w-[20rem] h-full overflow-auto no-scrollbar text-gray-300 pb-24 user-card-bg border-r border-r-gray-600 left-[7.5rem]">
      <h1 className="fixed border-b-2 user-card-bg border-b-gray-700 w-[19.9rem] p-2">
        Direct Messages
      </h1>
      <div className="pt-10">
        {friends.map((friend) => {
          const { id, avatar_url, user_name } = friend;
          return (
            <div
              key={id}
              onClick={() => getDirectMessages(id)}
              className="hover:bg-gray-800 cursor-pointer transition duration-300 bg-transparent text-gray-200 rounded-xl h-[60px] flex items-center m-2 p-2"
            >
              <img src={avatar_url} className="w-12 h-12 rounded-full mr-2" />
              <h1>{user_name}</h1>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center">
        <hr className="w-14 h-[2px] border-none my-2 bg-gray-500" />
      </div>
    </div>
  );
};

export default DirectChat;
