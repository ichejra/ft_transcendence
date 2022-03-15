import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { fetchAllUsers, fetchUserFriends } from "../features/userProfileSlice";
import { fetchPendingStatus } from "../features/friendsManagmentSlice";
import { updateGlobalState } from "../features/globalSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";

export const socket = io("http://localhost:3000/refresh");

const SocketProvider: React.FC = ({ children }) => {
  const dispatch = useAppDispatch();
  const { refresh } = useAppSelector((state) => state.globalState);
  useEffect(() => {
    socket.on("refresh", () => {
      dispatch(updateGlobalState());
      console.log("trigger the refresh");
    });
    return () => {
      socket.off("refresh");
    };
  }, [socket]);

  useEffect(() => {
    dispatch(fetchUserFriends());
    dispatch(fetchAllUsers());
    dispatch(fetchPendingStatus());
    console.log("--------------------> refershhhhhh");
  }, [refresh]);

  return <>{children}</>;
};

export default SocketProvider;
