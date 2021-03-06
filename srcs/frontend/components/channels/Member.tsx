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
  inviteToGame: (user: User) => void;
}

const Member: React.FC<MemberProps> = ({
  user,
  userRole,
  userStatus,
  chId,
  channelName,
  inviteToGame,
}) => {
  const { loggedMemberRole } = useAppSelector((state) => state.channels);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [showMuteOptions, setShowMuteOptions] = useState(false);
  const [showBaneOptions, setShowBanOptions] = useState(false);
  const menuRef = useRef<any>(null);
  const muteTimer = useRef<any>(null);
  const banTimer = useRef<any>(null);
  const dispatch = useAppDispatch();
  const { loggedUser } = useAppSelector((state) => state.user);

  const setAdmin = (id: number) => {
    dispatch(setMemberAsAdmin({ channelId: chId, memberId: id })).then(() => {
      socket.emit("member_status_changed", {
        room: channelName,
        channelId: chId,
      });
      socket.emit("update_member_status", {
        room: channelName,
        channelId: chId,
        status: "set_admin",
        userId: id,
      });
      dispatch(getChannelMembersList(chId));
      setToggleMenu(false);
    });
  };

  const removeAdmin = (id: number) => {
    dispatch(setAdminAsMember({ channelId: chId, memberId: id })).then(() => {
      socket.emit("member_status_changed", {
        room: channelName,
        channelId: chId,
      });
      socket.emit("update_member_status", {
        room: channelName,
        channelId: chId,
        status: "remove_admin",
        userId: id,
      });
      dispatch(getChannelMembersList(chId));
      setToggleMenu(false);
    });
  };

  const setMuteDelay = (id: number) => {
    setShowMuteOptions(true);
  };

  const setBanDelay = (id: number) => {
    setShowBanOptions(true);
  };

  const muteUser = (e: any, id: number) => {
    const muteTime = Number(e.target.dataset.time);
    dispatch(muteChannelMember({ channelId: chId, memberId: id })).then(() => {
      socket.emit("member_status_changed", {
        room: channelName,
        channelId: chId,
      });
      socket.emit("update_member_status", {
        room: channelName,
        channelId: chId,
        status: "mute",
        userId: id,
        time: muteTime,
      });
      dispatch(getChannelMembersList(chId)).then(() => {
        muteTimer.current = setTimeout(() => {
          unmuteUser(id);
          clearTimeout(muteTimer.current);
        }, muteTime * 1000);
      });
      setToggleMenu(false);
      setShowMuteOptions(false);
    });
  };

  const unmuteUser = (id: number) => {
    dispatch(unmuteChannelMember({ channelId: chId, memberId: id })).then(
      () => {
        socket.emit("member_status_changed", {
          room: channelName,
          channelId: chId,
        });
        socket.emit("update_member_status", {
          room: channelName,
          channelId: chId,
          status: "unmute",
          userId: id,
        });
        dispatch(getChannelMembersList(chId));
        clearTimeout(muteTimer.current);
        setToggleMenu(false);
      }
    );
  };

  const banUser = (e: any, id: number) => {
    const banTime = Number(e.target.dataset.time);
    dispatch(banChannelMember({ channelId: chId, memberId: id })).then(() => {
      socket.emit("member_status_changed", {
        room: channelName,
        channelId: chId,
      });
      socket.emit("update_member_status", {
        room: channelName,
        channelId: chId,
        status: "ban",
        userId: id,
      });
      dispatch(getChannelMembersList(chId)).then(() => {
        banTimer.current = setTimeout(() => {
          unbanUser(id);
          clearTimeout(banTimer.current);
        }, banTime * 1000);
      });
      setToggleMenu(false);
      setShowBanOptions(false);
    });
  };

  const unbanUser = (id: number) => {
    dispatch(unbanChannelMember({ channelId: chId, memberId: id })).then(() => {
      socket.emit("member_status_changed", {
        room: channelName,
        channelId: chId,
      });
      socket.emit("update_member_status", {
        room: channelName,
        channelId: chId,
        status: "unban",
        userId: id,
      });
      dispatch(getChannelMembersList(chId));
      clearTimeout(banTimer.current);
      setToggleMenu(false);
    });
  };

  const kickUser = (id: number) => {
    dispatch(kickChannelMember({ channelId: chId, memberId: id })).then(() => {
      socket.emit("member_status_changed", {
        room: channelName,
        channelId: chId,
      });
      socket.emit("update_member_status", {
        room: channelName,
        channelId: chId,
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
        setShowMuteOptions(false);
        setShowBanOptions(false);
      }
    };
    document.addEventListener("mousedown", updateUserMenu);
    return () => {
      document.removeEventListener("mousedown", updateUserMenu);
    };
  }, [toggleMenu]);

  return (
    <div className="relative flex items-center justify-between my-2">
      <div className="relative flex items-center">
        <div className="relative">
          {user.state === "online" ? (
            <GoPrimitiveDot
              size="1.3rem"
              className="absolute text-green-400 right-[1px] -bottom-[2px]"
            />
          ) : user.state === "in_game" ? (
            <GoPrimitiveDot
              size="1.3rem"
              className="absolute text-orange-400 right-[1px] -bottom-[2px]"
            />
          ) : (
            <GoPrimitiveDot
              size="1.3rem"
              className="absolute text-gray-400 right-[1px] -bottom-[2px]"
            />
          )}
          <img
            src={user.avatar_url}
            alt={user.user_name}
            className="w-10 h-10 rounded-full mr-2"
          />
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
          <p className="text-[12px] font-thin text-gray-400">{user.state}</p>
        </div>
      </div>
      {loggedUser.id !== user.id && user.state !== "in_game" && (
        <button
          onClick={() => inviteToGame(user)}
          className="absolute right-8 bg-green-400 py-1 px-2 text-[12px] ml-4 rounded-sm hover:scale-105 hover:bg-green-300 transition duration-300"
        >
          invite
        </button>
      )}
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
            {userStatus !== "banned" ? (
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
                  <div>
                    {!showMuteOptions ? (
                      <MenuItem
                        func={setMuteDelay}
                        user={user}
                        title="Mute"
                        icon={3}
                      />
                    ) : (
                      <TimerOptions func={muteUser} user={user} />
                    )}
                  </div>
                ) : (
                  <MenuItem
                    func={unmuteUser}
                    user={user}
                    title="Unmute"
                    icon={3}
                  />
                )}
                {userStatus !== "banned" ? (
                  <div>
                    {!showBaneOptions ? (
                      <MenuItem
                        func={setBanDelay}
                        user={user}
                        title="Ban"
                        icon={4}
                      />
                    ) : (
                      <TimerOptions func={banUser} user={user} />
                    )}
                  </div>
                ) : (
                  <MenuItem
                    func={unbanUser}
                    user={user}
                    title="Unban"
                    icon={4}
                  />
                )}
                <MenuItem func={kickUser} user={user} title="Kick" icon={5} />
              </ul>
            ) : (
              <ul>
                <MenuItem func={unbanUser} user={user} title="Unban" icon={4} />
              </ul>
            )}
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
  <FaUserSlash key={1} size="1.5rem" className="mr-2  text-red-500" />,
  <RiShieldUserFill key={2} size="1.5rem" className="mr-2  text-red-500" />,
  <BiVolumeMute key={3} size="1.5rem" className="mr-2  text-red-500" />,
  <HiOutlineBan key={4} size="1.5rem" className="mr-2  text-red-500" />,
  <GiBootKick key={5} size="1.5rem" className="mr-2  text-red-500" />,
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

interface TimerProps {
  func: (e: any, id: number) => void;
  user: User;
}

const TimerOptions: React.FC<TimerProps> = ({ func, user }) => {
  return (
    <div className="font-sans flex justify-between text-sm px-2 p-1">
      <button
        data-time="10"
        onClick={(e) => func(e, user.id)}
        className="border-[1px] border-gray-700 p-1 hover:bg-blue-300 hover:bg-opacity-30 transition duration-300"
      >
        10sec
      </button>
      <button
        data-time="300"
        onClick={(e) => func(e, user.id)}
        className="border-[1px] border-gray-700 p-1 hover:bg-blue-300 hover:bg-opacity-30 transition duration-300"
      >
        5min
      </button>
      <button
        data-time="3600"
        onClick={(e) => func(e, user.id)}
        className="border-[1px] border-gray-700 p-1 hover:bg-blue-300 hover:bg-opacity-30 transition duration-300"
      >
        1h
      </button>
      <button
        data-time="86400"
        onClick={(e) => func(e, user.id)}
        className="border-[1px] border-gray-700 p-1 hover:bg-blue-300 hover:bg-opacity-30 transition duration-300"
      >
        24h
      </button>
      <button
        data-time="360000"
        onClick={(e) => func(e, user.id)}
        className="border-[1px] border-gray-700 p-1 hover:bg-blue-300 hover:bg-opacity-30 transition duration-300"
      >
        100h
      </button>
    </div>
  );
};

export default Member;
