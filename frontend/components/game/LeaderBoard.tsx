import { useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { useAppSelector } from "../../app/hooks";

interface Props {
  setOpenModal: (a: boolean) => void;
}

const LeaderBoard: React.FC<Props> = ({ setOpenModal }) => {
  const divRef = useRef(null);
  // const { gameHistory } = useAppSelector((state) => state.user);
  return (
    <div
      onClick={(e) => {
        if (e.target == divRef.current) setOpenModal(false);
      }}
      className="fixed top-0 left-0 z-10 bg-black bg-opacity-75 w-full h-full"
    >
      <div
        ref={divRef}
        className="flex flex-col justify-center items-center h-full mt-20 md:mt-0"
      >
        <div className="text-gray-200 overflow-auto no-scrollbar md:h-[40rem] w-full pb-24 md:pb-0 md:w-[40rem] rounded-xl p-4">
          <div className="flex justify-between items-center mx-2 mb-4 md:mb-10">
            <h1 className="text-[lightgray] sm:text-[20px] text-[16px] underline underline-offset-2 game-family">
              LEADER BOARD
            </h1>
            <FaTimes
              size="2rem"
              className="cursor-pointer transition duration-300 hover:text-yellow-300"
              onClick={() => setOpenModal(false)}
            />
          </div>
          <div className="mb-20">
            <div className="flex justify-center flex-col items-center">
              {Array.from({ length: 10 }).map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`w-11/12 md:w-[38rem] h-[6rem] m-6 mb-1 flex justify-between rounded-t-md items-center shadow-lg shadow-white/40 ${index === 0 ? "bg-yellow-500" : index===1 ? "bg-zinc-400" : index===2? "bg-amber-700" : "bg-black"}  relative  border-t-2 border-x-2 border-t-[lightgrey]`}
                  >
                    <div className="w-1/2 ">
                      <div className="flex items-center">
                        <img
                          src="/images/profile.jpeg"
                          className="sm:w-20 sm:h-20 h-14 w-16 rounded-full sm:m-4 sm:ml-5 m-1 ml-2"
                        />
                        <h1
                          className="game-family sm:text-[20px] text-[11px] cursor-pointer "
                          // onClick={() =}
                        >
                          lalala
                        </h1>
                      </div>
                    </div>
                    <div className="sm:mr-16 mr-2 game-family sm:text-[25px] text-[14px] font-bold flex items-center">
                      <span className="sm:text-[12px] text-[7px]">Points:</span>
                      100
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;

// import React from "react";
// import { GiTrophyCup, GiDiamondTrophy } from "react-icons/gi";
// import { GrTrophy } from "react-icons/gr";

// const LeaderBoard = () => {

//   const navigateToUserProfile = () => {
//     //TODO: navigate to user profile
//     console.log('helloooo');
//   }
//   return (
//     <div className="mb-20">
//       <div className="flex justify-center items-center p-10  ">
//         <h1 className="text-[lightgray] sm:text-[20px] text-[16px] underline underline-offset-2 game-family">
//           LEADER BOARD
//         </h1>
//       </div>
//       <div className="flex justify-center flex-col items-center">
//         {Array.from({ length: 10 }).map((item, index) => {
//           return (
//             <div
//               key={index}
//               className="w-11/12 md:w-[45rem] h-[6rem] m-6 mb-1 flex justify-between items-center bg-[lightgray] rounded-md relative shadow-xl shadow-cyan-300/40"
//             >
//               <div className="w-1/2 ">
//                 <div className="flex items-center">
//                   <img
//                     src="/images/profile.jpeg"
//                     className="sm:w-20 sm:h-20 h-16 w-16 rounded-full sm:m-4 sm:ml-5 m-1 ml-2"
//                   />
//                   <h1
//                     className="game-family sm:text-[20px] text-[12px] cursor-pointer "
//                     onClick={navigateToUserProfile}
//                   >
//                     lalala
//                   </h1>
//                 </div>
//               </div>
//               <div className="sm:mr-16 mr-2 game-family sm:text-[25px] text-[14px] font-bold flex items-center">
//                 <span className="sm:text-[12px] text-[9px]">Points:</span>
//                 100
//               </div>
//             </div>
//           );
//         })}
//       </div>
//       {/* {Array.from({ length: 10 }).map((item, index) => {
//         return (
//           <div
//             key={index}
//             className="w-11/12 md:w-2/3 h-[6rem] sm:m-6 mb-6 flex justify-between items-center bg-[lightgrey] rounded-md"
//           >
//             <div className=" h-[7rem] w-1/2 flex items-center justify-between relative">
//               <div className="flex items-center">
//                 <img
//                   src="/images/profile.jpeg"
//                   className="w-20 h-20 rounded-full m-4 ml-5"
//                 />
//                 <h1 className="about-family sm:text-[16px] text-[12px]">
//                   lalala
//                 </h1>
//               </div>
//               <div className="sm:mr-4 -mr-14 game-family sm:text-[20px] text-[12px] font-bold">
//                 10
//               </div>
//             </div>
//             <div className="flex p-2 text-center relative h-[7rem] w-48">
//               <div className="hover:scale-125 h-4">
//                 <button className="bg-none game-family rounded sm:text-[11px] text-[9.3px]">
//                   Watch Game
//                 </button>
//               </div>
//             </div>
//             <div className=" h-[7rem] w-1/2 flex items-center justify-between relative">
//               <div className="sm:ml-4 -ml-14 game-family sm:text-[20px] text-[12px] font-bold">
//                 10
//               </div>
//               <div className="flex items-center">
//                 <h1 className="about-family sm:text-[16px] text-[12px]">
//                   lalala
//                 </h1>
//                 <img
//                   src="/images/profile.jpeg"
//                   className="sm:w-20 sm:h-20 w-14 h-14 rounded-full m-4 mr-5"
//                 />
//               </div>
//             </div>
//           </div>
//         );
//       })} */}
//     </div>
//   );
// };

// export default LeaderBoard;
