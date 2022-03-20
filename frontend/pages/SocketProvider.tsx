import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  fetchAllUsers,
  fetchUserFriends,
  fetchNoRelationUsers,
} from "../features/userProfileSlice";
import {
  fetchPendingStatus,
  fetchBlockedUsers,
} from "../features/friendsManagmentSlice";
import { updateGlobalState } from "../features/globalSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Cookies from "js-cookie";

export const socket = io("http://localhost:3000", {
    auth: {
      token: Cookies.get("accessToken"),
    }
});

const SocketProvider: React.FC = ({ children }) => {
  const dispatch = useAppDispatch();
  const { refresh } = useAppSelector((state) => state.globalState);
  // useEffect(() => {
  //   socket.on("refresh", () => {
  //     dispatch(updateGlobalState());
  //     console.log("trigger the refresh");
  //   });
  //   return () => {
  //     socket.off("refresh");
  //   };
  // }, [socket]);

  // useEffect(() => {
  //   dispatch(fetchUserFriends());
  //   dispatch(fetchAllUsers());
  //   dispatch(fetchNoRelationUsers());
  //   dispatch(fetchPendingStatus());
  //   dispatch(fetchBlockedUsers());
  //   console.log("--------------------> refershhhhhh");
  // }, [refresh]);

  return <>{children}</>;
};

export default SocketProvider;
