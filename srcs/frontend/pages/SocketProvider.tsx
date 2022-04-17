import { useEffect } from "react";
import { io } from "socket.io-client";
import {
  fetchAllUsers,
  fetchUserFriends,
  fetchNoRelationUsers,
  setIsPending,
} from "../features/userProfileSlice";
import {
  fetchPendingStatus,
  fetchBlockedUsers,
} from "../features/friendsManagmentSlice";
import { updateGlobalState } from "../features/globalSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Cookies from "js-cookie";
import swal from "sweetalert";
import { useNavigate } from "react-router";
import { useLocation } from "react-router";

export const socket = io("http://192.168.99.117:3001", {
  auth: {
    token: Cookies.get("accessToken"),
  },
});

const SocketProvider: React.FC = ({ children }) => {
  const dispatch = useAppDispatch();
  const { refresh } = useAppSelector((state) => state.globalState);
  const { loggedUser } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    socket.on("receive_notification", () => {
      dispatch(updateGlobalState());
    });

    socket.on("logout", () => {
      window.location.reload();
    });
    return () => {
      socket.off("logout");
      socket.off("receive_notification");
    };
  }, [socket]);

  useEffect(() => {
    if (Cookies.get("accessToken")) {
      dispatch(fetchAllUsers());
      dispatch(fetchNoRelationUsers()).then(() => {
        dispatch(fetchPendingStatus());
        if (
          pathname === `profile/${loggedUser.id}` ||
          pathname === `users/${loggedUser.id}/friends`
        ) {
          dispatch(fetchUserFriends());
        }
        dispatch(fetchBlockedUsers());
      });
      if (pathname.includes("profile")) {
        dispatch(setIsPending(false));
      }
    }
  }, [refresh]);

  useEffect(() => {
    socket.on("game_invitation", ({ inviter, challengeId }) => {
      swal(`You have been invited to a game by ${inviter.display_name}.`, {
        buttons: {
          cancel: {
            text: "Reject",
            value: null,
            visible: true,
            className: "",
            closeModal: true,
          },
          confirm: {
            text: "Accept",
            value: true,
            visible: true,
            className: "",
            closeModal: true,
          },
        },
      }).then((value) => {
        if (value) {
          socket.emit("accept_challenge", { challengeId });
          navigate("/game");
        } else {
          socket.emit("reject_challenge", { challengeId, loggedUser });
        }
      });
    });
    return () => {
      socket.off("game_invitation");
    };
  }, []);

  useEffect(() => {
    socket.on("challenge_accepted", (data) => {
      navigate("/game");
    });
    socket.on("challenge_rejected", ({ user }) => {
      swal(`Your request has been rejected by ${user.display_name}!`);
    });
    socket.on("inviter_in_game", () => {
      swal("FINISH YOUR CURRENT GAME FIRST... 😡😡😡");
    });
    socket.on("invitee_in_game", ({ user }) => {
      swal(`${user.display_name} is in game right now!`);
    });
    socket.on("inviter_is_in_game", ({ user }) => {
      swal(`${user.display_name} is in game right now!`);
    });
  }, []);

  return <>{children}</>;
};

export default SocketProvider;
