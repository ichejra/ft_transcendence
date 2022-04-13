import React from "react";

const LeaderBoard = () => {

  const navigateToUserProfile = () => {
    //TODO: navigate to user profile
    console.log('helloooo');
    
  }
  return (
    <div className="mb-20">
      <div className="flex justify-center items-center p-10  ">
        <h1 className="text-[lightgray] sm:text-[20px] text-[16px] underline underline-offset-2 game-family">
          LEADER BOARD
        </h1>
      </div>
      <div className="flex justify-center flex-col items-center">
        {Array.from({ length: 10 }).map((item, index) => {
          return (
            <div
              key={index}
              className="w-11/12 md:w-[45rem] h-[6rem] m-6 mb-1 flex justify-between items-center bg-[lightgray] rounded-md relative shadow-xl shadow-cyan-300/40"
            >
              <div className="w-1/2 ">
                <div className="flex items-center">
                  <img
                    src="/images/profile.jpeg"
                    className="sm:w-20 sm:h-20 h-16 w-16 rounded-full sm:m-4 sm:ml-5 m-1 ml-2"
                  />
                  <h1
                    className="game-family sm:text-[20px] text-[12px] cursor-pointer "
                    onClick={navigateToUserProfile}
                  >
                    lalala
                  </h1>
                </div>
              </div>
              <div className="sm:mr-16 mr-2 game-family sm:text-[25px] text-[14px] font-bold flex items-center">
                <span className="sm:text-[12px] text-[9px]">Points:</span>
                100
              </div>
            </div>
          );
        })}
      </div>
      {/* {Array.from({ length: 10 }).map((item, index) => {
        return (
          <div
            key={index}
            className="w-11/12 md:w-2/3 h-[6rem] sm:m-6 mb-6 flex justify-between items-center bg-[lightgrey] rounded-md"
          >
            <div className=" h-[7rem] w-1/2 flex items-center justify-between relative">
              <div className="flex items-center">
                <img
                  src="/images/profile.jpeg"
                  className="w-20 h-20 rounded-full m-4 ml-5"
                />
                <h1 className="about-family sm:text-[16px] text-[12px]">
                  lalala
                </h1>
              </div>
              <div className="sm:mr-4 -mr-14 game-family sm:text-[20px] text-[12px] font-bold">
                10
              </div>
            </div>
            <div className="flex p-2 text-center relative h-[7rem] w-48">
              <div className="hover:scale-125 h-4">
                <button className="bg-none game-family rounded sm:text-[11px] text-[9.3px]">
                  Watch Game
                </button>
              </div>
            </div>
            <div className=" h-[7rem] w-1/2 flex items-center justify-between relative">
              <div className="sm:ml-4 -ml-14 game-family sm:text-[20px] text-[12px] font-bold">
                10
              </div>
              <div className="flex items-center">
                <h1 className="about-family sm:text-[16px] text-[12px]">
                  lalala
                </h1>
                <img
                  src="/images/profile.jpeg"
                  className="sm:w-20 sm:h-20 w-14 h-14 rounded-full m-4 mr-5"
                />
              </div>
            </div>
          </div>
        );
      })} */}
    </div>
  );
};

export default LeaderBoard;
