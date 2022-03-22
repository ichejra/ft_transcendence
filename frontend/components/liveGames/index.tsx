import React , { useEffect, useState } from 'react';

const LiveGames = () => {
  console.log("I am from live games");
  
  return (
    <div className='w-full h-full user-card-bg flex justify-center'>
      <div className='page-50 mt-20 flex w-full 2xl:w-[80rem] flex-col items-center'>
        <div className='flex flex-col lg:flex-row  w-full 2xl:w-[80rem] p-2 m-2 mt-20'>
          <div className='w-full lg:w-2/3'>
            <h1 className='title-family text-white text-opacity-80 text-2xl pb-4'>
              PONG
            </h1>
            <p className='text-family text-white text-opacity-80'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda
              laborum expedita qui saepe voluptas. Eveniet facere aut explicabo
              amet illum, cum in sit veniam provident blanditiis ab a omnis
              consectetur.
            </p>
            <div className='title-family text-white text-opacity-80 text-2xl pb-4 bg-white w-10 h-54'></div>
          </div>
        </div>
        <div className='flex flex-col lg:flex-row  w-full 2xl:w-[80rem] p-2 m-2 mt-20'>
          <div className='w-full lg:w-2/3'>
           
            <div className='title-family text-white text-opacity-80 text-2xl pb-4 bg-white w-26 h-36'></div>
          </div>
        </div>
      </div>
      <div className='mb-32 flex flex-col items-center'>
        <h3 className='about-family text-white text-opacity-80 text-center'>
          Bring Back Old Memories With Old Friends
        </h3>
      </div>
    </div>
  );
};






// const mailchimpURL = `[Your Mailchimp subscription URL]`;

// const outerCardStyle = `
//       padding: 0;
//       box-shadow: 0px 5px 35px 0px rgba(50, 50, 93, 0.17);
//     `;
// const subContainerStyle = `
//       box-shadow: 0 2px 5px -1px rgba(50,50,93,.25), 0 1px 3px -1px rgba(0,0,0,.3);
//       align-items: center;
//     `;
// const subInputStyle = `
//       border-width: 0;
//       margin: 0;
//     `;
// const subButtonStyle = `
//       border-radius: 0;
//       flex-grow: 1;
//       background-color: #fdfdfd;
//       color: #000000;
//     `;

// const LiveGames = () => (
//   <div>
//     <SubscribeCard
//       mailchimpURL={mailchimpURL}
//       outerCardStyle={outerCardStyle}
//       subContainerStyle={subContainerStyle}
//       subInputStyle={subInputStyle}
//       subButtonStyle={subButtonStyle}
//     />
//   </div>
// );


export default LiveGames;
