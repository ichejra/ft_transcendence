//
import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import Cookies from "js-cookie";
import GlobalUsers from "./globaleUsers";
import { fetchBlockedUsers } from "../../features/friendsManagmentSlice";

const BlockedUsers: React.FC = () => {
  const dispatch = useAppDispatch();
  const { blockedUsers } = useAppSelector((state) => state.friends);

  useEffect(() => {
    if (Cookies.get("accessToken")) {
      dispatch(fetchBlockedUsers());
    }
  }, []);

  return <GlobalUsers users={blockedUsers} type="blocked" />;
};

export default BlockedUsers;
