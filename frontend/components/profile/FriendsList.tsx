import { Link } from "react-router-dom";
import { useState } from "react";
import { AiOutlineRight } from "react-icons/ai";
import UsersModal from "../modals/ConfirmationModal";
import { FaUsersSlash } from "react-icons/fa";
import { User, fetchUserFriends } from "../../features/userProfileSlice";
import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";

interface Props {
  friends: User[];
}

// const friendsPosition = [
//   "friends--index-one",
//   "friends--index-two",
//   "friends--index-three",
// ];

const friendsPosition = ["left-[1rem]", "left-[3rem]", "left-[5rem]"];

const FriendsList: React.FC<Props> = ({ friends }) => {
  const dispatch = useAppDispatch();
  const [confirmationModal, setConfirmationModal] = useState(false);
  console.log("frds: ", friends);

  useEffect(() => {
    dispatch(fetchUserFriends());
  }, []);

  // return (
  //   <div className="lg:w-1/4 pb-12">
  //     <div className="flex justify-between">
  //       <h1 className="text-xl font-bold p-2">Friends</h1>
  //       <Link to="/profile/list">
  //         <div className="cursor-pointer flex items-center font-bold text-gray-600 hover:text-yellow-400 transition duration-300">
  //           See All
  //           <AiOutlineRight />
  //         </div>
  //       </Link>
  //       {confirmationModal && (
  //         <UsersModal setConfirmationModal={setConfirmationModal} />
  //       )}
  //     </div>
  //     {!friends.length ? (
  //       <div className="border rounded-lg p-4 shadow-md h-80">
  //         <div className="flex h-full justify-center items-center">
  //           <FaUsersSlash className="w-20 h-20 text-gray-200" />
  //         </div>
  //       </div>
  //     ) : (
  //       <div className="border rounded-lg p-4 shadow-md h-80">
  //         {friends.map((friend) => {
  //           const { id, avatar_url, display_name, user_name } = friend;
  //           return (
  //             <Link key={id} to={`/profile/${id}`}>
  //               <div className="flex items-center p-2 hover:bg-gray-200 cursor-pointer rounded-lg transition duration-300">
  //                 <img
  //                   src={avatar_url}
  //                   className="bg-gray-300 h-14 w-14 rounded-full bg-contain"
  //                 />
  //                 <div className="flex flex-col justify-center pl-4 capitalize ">
  //                   <h4 className="font-bold text-lg">{display_name}</h4>
  //                   <p className="text-gray-400 font-small text-sm font-sans">
  //                     @{user_name}
  //                   </p>
  //                 </div>
  //               </div>
  //             </Link>
  //           );
  //         })}
  //       </div>
  //     )}
  //   </div>
  // );

  return (
    <div className="md:relative left-[26rem] xl:left-[30rem] md:w-[22rem] lg:w-[24rem] my-4 xl:w-[28rem]">
      <div className="flex justify-between mr-2">
        <h1 className="about-family text-xl py-2 px-4 text-white text-opacity-80">
          Friends
        </h1>
        <div className="flex items-center">
          <Link to="/profile/list">
            <div className="about-family flex items-center mr-3 text-sm text-gray-500 header-item transition duration-300">
              See All
              <AiOutlineRight />
            </div>
          </Link>
        </div>
        {confirmationModal && (
          <UsersModal setConfirmationModal={setConfirmationModal} />
        )}
      </div>
      <hr className="h-[1px] border-0 mx-4 bg-gray-700" />
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
                  <Link key={id} to={`/profile/${id}`}>
                    <img
                      src={avatar_url}
                      className="bg-gray-300 h-12 w-12 rounded-full bg-contain"
                    />
                  </Link>
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
    </div>
  );
};

export default FriendsList;
/*  friends.length > 1 && friends.length < 3
                  ? 7
                  : friends.length > 2
                  ? 9
                  : 5 */
