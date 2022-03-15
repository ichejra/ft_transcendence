import { useEffect } from "react";
import { fetchUserFriends } from "../../features/userProfileSlice";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import GlobalUsers from "../users/globaleUsers";
import Cookies from "js-cookie";

const FullFriendsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { friends } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (Cookies.get("accessToken")) {
      dispatch(fetchUserFriends());
    }
  }, []);

  useEffect(() => {
    console.log(3);
    if (Cookies.get("accessToken")) {
      dispatch(fetchUserFriends());
    }
  }, []);

  return <GlobalUsers users={friends} type="friends" />;
};

export default FullFriendsList;
