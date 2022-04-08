import React, { useEffect, useRef, useState } from "react";
import { FaUserSlash } from "react-icons/fa";
import { HiOutlineBan } from "react-icons/hi";
import { GiBootKick } from "react-icons/gi";
import { BiVolumeMute } from "react-icons/bi";
import { GoPrimitiveDot } from "react-icons/go";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiVolumeMuteLine, RiShieldUserFill } from "react-icons/ri";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { Link } from "react-router-dom";
import { User } from "../../features/userProfileSlice";
import {
  getChannelMembersList,
  setMemberAsAdmin,
  setAdminAsMember,
  muteChannelMember,
  unmuteChannelMember,
  banChannelMember,
  unbanChannelMember,
  kickChannelMember,
} from "../../features/chatSlice";
import { socket } from "../../pages/SocketProvider";

interface MemberProps {
  id: number;
  user: User;
  userRole: string;
  userStatus: string;
  chId: number;
  channelName: string;
}

const Member: React.FC<MemberProps> = ({
  user,
  userRole,
  userStatus,
  chId,
  channelName,
}) => {
  const { memberStatus, loggedMemberRole } = useAppSelector(
    (state) => state.channels
  );
  const [toggleMenu, setToggleMenu] = useState(false);
  const menuRef = useRef<any>(null);
  const dispatch = useAppDispatch();

  const setAdmin = (id: number) => {
    dispatch(setMemberAsAdmin({ channelId: chId, memberId: id })).then(() => {
      socket.emit("member_status_changed", channelName);
      socket.emit("update_member_status", {
        room: channelName,
        status: "set_admin",
        userId: id,
      });
      dispatch(getChannelMembersList(chId));
      setToggleMenu(false);
    });
  };

  const removeAdmin = (id: number) => {
    dispatch(setAdminAsMember({ channelId: chId, memberId: id })).then(() => {
      socket.emit("member_status_changed", channelName);
      socket.emit("update_member_status", {
        room: channelName,
        status: "remove_admin",
        userId: id,
      });
      dispatch(getChannelMembersList(chId));
      setToggleMenu(false);
    });
  };

  const muteUser = (id: number) => {
    dispatch(muteChannelMember({ channelId: chId, memberId: id })).then(() => {
      socket.emit("member_status_changed", channelName);
      socket.emit("update_member_status", {
        room: channelName,
        status: "mute",
        userId: id,
        time: 10,
      });
      dispatch(getChannelMembersList(chId));
      setToggleMenu(false);
    });
  };

  const unmuteUser = (id: number) => {
    dispatch(unmuteChannelMember({ channelId: chId, memberId: id })).then(
      () => {
        socket.emit("member_status_changed", channelName);
        socket.emit("update_member_status", {
          room: channelName,
          status: "unmute",
          userId: id,
        });
        dispatch(getChannelMembersList(chId));
        setToggleMenu(false);
      }
    );
  };

  const banUser = (id: number) => {
    dispatch(banChannelMember({ channelId: chId, memberId: id })).then(() => {
      socket.emit("member_status_changed", channelName);
      socket.emit("update_member_status", {
        room: channelName,
        status: "ban",
        userId: id,
      });
      dispatch(getChannelMembersList(chId));
      setToggleMenu(false);
    });
  };

  const unbanUser = (id: number) => {
    dispatch(unbanChannelMember({ channelId: chId, memberId: id })).then(() => {
      socket.emit("member_status_changed", channelName);
      socket.emit("update_member_status", {
        room: channelName,
        status: "unban",
        userId: id,
      });
      dispatch(getChannelMembersList(chId));
      setToggleMenu(false);
    });
  };

  const kickUser = (id: number) => {
    dispatch(kickChannelMember({ channelId: chId, memberId: id })).then(() => {
      socket.emit("member_status_changed", channelName);
      socket.emit("update_member_status", {
        room: channelName,
        status: "kick",
        userId: id,
      });
      dispatch(getChannelMembersList(chId));
      setToggleMenu(false);
    });
  };

  useEffect(() => {
    const updateUserMenu = (e: Event) => {
      if (
        toggleMenu &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setToggleMenu(false);
      }
    };
    document.addEventListener("mousedown", updateUserMenu);
    return () => {
      document.removeEventListener("mousedown", updateUserMenu);
    };
  }, [toggleMenu]);

  //   useEffect(() => {
  //     console.log("[Member] newChannelId --------->", chId, memberStatus);
  //     if (chId) {
  //       dispatch(getChannelMembersList(chId));
  //     }
  //   }, [memberStatus]);

  return (
    <div className="relative flex items-center justify-between my-2">
      <div className="flex items-center">
        <div className="relative">
          {user.state === "online" ? (
            <GoPrimitiveDot
              size="1.3rem"
              className="absolute text-green-400 right-[1px] -bottom-[2px]"
            />
          ) : (
            <GoPrimitiveDot
              size="1.3rem"
              className="absolute text-gray-400 right-[1px] -bottom-[2px]"
            />
          )}
          <img src={user.avatar_url} className="w-10 rounded-full mr-2" />
        </div>
        <div>
          <Link to={`/profile/${user.id}`}>
            <p
              className={`${
                (userRole === "owner" || userRole === "admin") &&
                "text-blue-400"
              } hover:underline transition duration-300 cursor-pointer flex items-center`}
            >
              {user.user_name}
              {userStatus === "muted" && (
                <RiVolumeMuteLine size="1.3rem" className="text-red-500 ml-2" />
              )}
              {userStatus === "banned" && (
                <HiOutlineBan size="1.3rem" className="text-red-500 ml-2" />
              )}
            </p>
          </Link>
          <p className="text-[12px] font-thin text-gray-400">{userRole}</p>
        </div>
      </div>
      <div ref={menuRef}>
        {loggedMemberRole.userRole === "owner" && (
          <BsThreeDotsVertical
            onClick={() => {
              dispatch(getChannelMembersList(chId));
              setToggleMenu(!toggleMenu);
            }}
            className="hover:bg-opacity-30 hover:opacity-60 hover:bg-gray-400 user-card-bg rounded-full p-1 w-6 h-6 cursor-pointer transition duration-300"
          />
        )}
        {loggedMemberRole.userRole === "admin" && userRole === "member" && (
          <BsThreeDotsVertical
            onClick={() => {
              dispatch(getChannelMembersList(chId));
              setToggleMenu(!toggleMenu);
            }}
            className="hover:bg-opacity-30 hover:opacity-60 hover:bg-gray-400 user-card-bg rounded-full p-1 w-6 h-6 cursor-pointer transition duration-300"
          />
        )}

        {toggleMenu && (
          <div className="absolute z-10 top-2 border-gray-500 w-[230px] user-card-bg border user-menu">
            <ul className="">
              {userRole === "admin" &&
                loggedMemberRole.userRole === "owner" && (
                  <MenuItem
                    func={removeAdmin}
                    user={user}
                    title="Remove admin"
                    icon={1}
                  />
                )}
              {userRole === "member" &&
                loggedMemberRole.userRole === "owner" && (
                  <MenuItem
                    func={setAdmin}
                    user={user}
                    title="Set admin"
                    icon={2}
                  />
                )}
              {userStatus !== "muted" ? (
                <MenuItem func={muteUser} user={user} title="Mute" icon={3} />
              ) : (
                <MenuItem
                  func={unmuteUser}
                  user={user}
                  title="Unmute"
                  icon={3}
                />
              )}
              {userStatus !== "banned" ? (
                <MenuItem func={banUser} user={user} title="Ban" icon={4} />
              ) : (
                <MenuItem func={unbanUser} user={user} title="Unban" icon={4} />
              )}
              <MenuItem func={kickUser} user={user} title="Kick" icon={5} />
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

interface MenuProps {
  func: (id: number) => void;
  user: User;
  title: string;
  icon: number;
}

const icons = [
  ,
  <FaUserSlash size="1.5rem" className="mr-2  text-red-500" />,
  <RiShieldUserFill size="1.5rem" className="mr-2  text-red-500" />,
  <BiVolumeMute size="1.5rem" className="mr-2  text-red-500" />,
  <HiOutlineBan size="1.5rem" className="mr-2  text-red-500" />,
  <GiBootKick size="1.5rem" className="mr-2  text-red-500" />,
];

const MenuItem: React.FC<MenuProps> = ({ func, user, title, icon }) => {
  return (
    <li
      onClick={() => func(user.id)}
      className="flex items-center p-1 m-1 font-mono text-sm font-bold hover:bg-opacity-40 hover:bg-gray-400 transition duration-300 cursor-pointer"
    >
      {icons[icon]}
      {title}
      <span className="ml-1 font-mono font-normal">{user.user_name}</span>
    </li>
  );
};

export default Member;

//TODO FIX member menu visibility for admin
