import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { AiOutlineRight } from "react-icons/ai";
import { FaUsersSlash } from "react-icons/fa";
import { User, fetchSingleUser } from "../../features/userProfileSlice";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { friendsPosition } from "../../consts";

interface Props {
  friends: User[];
}

const FriendsList: React.FC<Props> = ({ friends }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isPageLoading, loggedUser } = useAppSelector((state) => state.user);

  const getFriendProfile = (id: number) => {
    dispatch(fetchSingleUser(id)).then((data: any) => {
      const friend: User = data.payload;
      navigate(`/profile/${friend.id}`);
    });
  };

  useEffect(() => {
    console.log("%cRENDER USER FRIENDS", "color:green; font-weight: bold");
  }, []);

  return (
    <div className="md:relative left-[26rem] xl:left-[30rem] md:w-[22rem] lg:w-[24rem] my-4 xl:w-[28rem]">
      <div className="flex justify-between mr-2">
        <h1 className="about-family text-xl py-2 px-4 text-white text-opacity-80">
          Friends
        </h1>
        <div className="flex items-center">
          <Link to={`/users/${loggedUser.id}/friends`}>
            <div className="about-family flex items-center mr-3 text-sm text-gray-500 header-item transition duration-300">
              See All
              <AiOutlineRight />
            </div>
          </Link>
        </div>
      </div>
      <hr className="h-[1px] border-0 mx-4 bg-gray-700" />
      {isPageLoading ? (
        <div className="loading-2 border-2 border-blue-600 w-12 h-12"></div>
      ) : (
        <div className="text-white text-opacity-80">
          {!friends.length ? (
            <div className="rounded-lg p-4 shadow-md h-20 bg-white bg-opacity-5">
              <div className="flex h-full justify-center items-center">
                <FaUsersSlash className="w-12 h-12 text-gray-200 opacity-30" />
              </div>
            </div>
          ) : (
            <div className="relative rounded-lg px-4 shadow-md h-20 flex items-center bg-white bg-opacity-5">
              {friends.slice(0, 3).map((friend, index) => {
                const { id, avatar_url } = friend;
                return (
                  <div
                    key={id}
                    className={`absolute ${friendsPosition[index]} hover:bg-gray-200  cursor-pointer rounded-lg transition 2duration-300`}
                  >
                    <img
                      onClick={() => getFriendProfile(id)}
                      key={id}
                      src={avatar_url}
                      className="bg-gray-300 h-12 w-12 rounded-full bg-contain"
                    />
                  </div>
                );
              })}
              <p
                className={`absolute ${
                  friends.length > 1 && friends.length < 3
                    ? "left-[7rem]"
                    : friends.length > 2
                    ? "left-[9rem]"
                    : "left-[5rem]"
                } right-[1rem] about-family text-[13px] text-gray-500`}
              >
                Friends with {friends[0].display_name}{" "}
                {friends.length > 1 && (
                  <span>and {friends.length - 1} others</span>
                )}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FriendsList;
