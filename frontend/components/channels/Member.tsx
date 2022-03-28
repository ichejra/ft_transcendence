import React, { useEffect, useRef, useState } from "react";
import { HiOutlineBan } from "react-icons/hi";
import { GiBootKick } from "react-icons/gi";
import { BiVolumeMute } from "react-icons/bi";
import { GoPrimitiveDot } from "react-icons/go";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiVolumeMuteLine } from "react-icons/ri";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { Link } from "react-router-dom";
import { User } from "../../features/userProfileSlice";
import {
  getChannelMembersList,
  muteChannelMember,
  banChannelMember,
  kickChannelMember,
} from "../../features/chatSlice";

interface MemberProps {
  id: number;
  user: User;
  userRole: string;
  userStatus: string;
  isAdmin: boolean;
  chId: number;
}

const Member: React.FC<MemberProps> = ({
  user,
  userRole,
  userStatus,
  isAdmin,
  chId,
}) => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const menuRef = useRef<any>(null);
  const dispatch = useAppDispatch();

  const muteUser = (id: number) => {
    dispatch(muteChannelMember({ channelId: chId, memberId: user.id })).then(
      () => {
        setToggleMenu(false);
      }
    );
  };
  const banUser = (id: number) => {
    dispatch(banChannelMember({ channelId: chId, memberId: user.id })).then(
      () => {
        setToggleMenu(false);
      }
    );
  };
  const kickUser = (id: number) => {
    dispatch(kickChannelMember({ channelId: chId, memberId: user.id })).then(
      () => {
        setToggleMenu(false);
      }
    );
  };

  const { memberStatus } = useAppSelector((state) => state.channels);

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

  useEffect(() => {
    dispatch(getChannelMembersList(chId));
  }, [memberStatus]);

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
        {isAdmin && userRole === "member" && (
          <BsThreeDotsVertical
            onClick={() => {
              setToggleMenu(!toggleMenu);
            }}
            className="hover:bg-opacity-30 hover:opacity-60 hover:bg-gray-400 user-card-bg rounded-full p-1 w-6 h-6 cursor-pointer transition duration-300"
          />
        )}
        {toggleMenu && (
          <div className="absolute z-10 top-2 border-gray-500 w-[200px] user-card-bg border user-menu">
            <ul className="">
              <li
                onClick={() => muteUser(user.id)}
                className="flex items-center p-1 m-1 font-mono text-sm font-bold hover:bg-opacity-40 hover:bg-gray-400 transition duration-300 cursor-pointer"
              >
                <BiVolumeMute size="1.5rem" className="mr-2  text-red-500" />
                Mute
                <span className="ml-1 font-mono font-normal">
                  {user.user_name}
                </span>
              </li>
              <li
                onClick={() => banUser(user.id)}
                className="flex items-center p-1 m-1 font-mono text-sm font-bold hover:bg-opacity-40 hover:bg-gray-400 transition duration-300 cursor-pointer"
              >
                <HiOutlineBan size="1.5rem" className="mr-2  text-red-500" />
                Ban
                <span className="ml-1 font-mono font-normal">
                  {user.user_name}
                </span>
              </li>
              <li
                onClick={() => kickUser(user.id)}
                className="flex items-center p-1 m-1 font-mono text-sm font-bold hover:bg-opacity-40 hover:bg-gray-400 transition duration-300 cursor-pointer"
              >
                <GiBootKick size="1.5rem" className="mr-2  text-red-500" />
                Kick
                <span className="ml-1 font-mono font-normal">
                  {user.user_name}
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Member;
