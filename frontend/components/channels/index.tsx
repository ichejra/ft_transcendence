const Channels = () => {
  return (
    <div className="page-100 h-full w-full mt-20 flex ">
      <div className="fixed h-full bg-green-200">
        <div className="border border-blue-400 rounded-lg w-[70px] h-[70px] flex items-center justify-center mx-6 my-3">Inbox</div>
        <hr />
        <div className="">{Array.from({ length: 5}).map((item, index) => {
          return <div className="border border-blue-400 rounded-lg w-[70px] h-[70px] flex items-center justify-center mx-6 my-3">ch{index + 1}</div>
        })}
        </div>
        <div className="border border-blue-400 rounded-lg w-[70px] h-[70px] flex items-center justify-center mx-6 my-3">+</div>
      </div>
      <div className="relative w-full text-white ml-6 left-[7.4rem]">
        <div className="fixed bg-gray-500 left-[7.4rem] text-white p-2 w-full">channel name</div>
        <div className='mt-12'>
          {Array.from({ length: 30 }).map((item, index) => {
            return <div className="my-8 mr-2 flex about-family items-center">
              <img src="/images/profile.jpeg" className="w-10 h-10 rounded-full mr-2" />
              <div>
                <p className='text-gray-300'>al7mar <span className="text-gray-500 text-xs">{new Date().toLocaleString("default", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}</span></p>
                <p className='text-xs'>accusamus nostrum reiciendis eveniet, rem aliquid corporis blanditiis itaque porro recusandae sunt. Voluptate, alias sequi.</p>
              </div>
            </div>
          })}
        </div>
      </div>
    </div>
  );
};

export default Channels;

