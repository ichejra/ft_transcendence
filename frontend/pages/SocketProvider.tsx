import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  fetchAllUsers,
  fetchUserFriends,
  fetchNoRelationUsers,
  setIsPending,
  setIsFriend,
} from "../features/userProfileSlice";
import {
  fetchPendingStatus,
  fetchBlockedUsers,
} from "../features/friendsManagmentSlice";
import { updateGlobalState } from "../features/globalSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Cookies from "js-cookie";
import { useLocation } from "react-router";

export const socket = io("http://localhost:3001", {
  auth: {
    token: Cookies.get("accessToken"),
  },
});

const SocketProvider: React.FC = ({ children }) => {
  const dispatch = useAppDispatch();
  const { refresh } = useAppSelector((state) => state.globalState);
  const { pathname } = useLocation();
  useEffect(() => {
    socket.on("receive_notification", () => {
      dispatch(updateGlobalState());
      console.log("trigger the refresh");
    });

    return () => {
      socket.off("receive_notification");
    };
  }, [socket]);

  useEffect(() => {
    if (Cookies.get("accessToken")) {
      console.log("General Render");
      dispatch(fetchAllUsers());
      dispatch(fetchNoRelationUsers()).then(() => {
        dispatch(fetchPendingStatus());
        if (pathname.includes("profile") || pathname.includes("friends")) {
          dispatch(fetchUserFriends());
        }
        dispatch(fetchBlockedUsers());
      });
      if (pathname.includes("profile")) {
        dispatch(setIsPending(false));
      }
      console.log("--------------------> refershhhhhh");
    }
  }, [refresh]);

  return <>{children}</>;
};

export default SocketProvider;
