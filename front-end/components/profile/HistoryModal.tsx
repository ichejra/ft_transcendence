import { useRef } from "react";
import { FaTimes } from "react-icons/fa";

interface Props {
  setOpenModal: (a: boolean) => void;
}

const HistoryModal: React.FC<Props> = ({ setOpenModal }) => {
  const divRef = useRef(null);
  return (
    <div
      onClick={(e) => {
        if (e.target == divRef.current) setOpenModal(false);
      }}
      className="fixed top-0 left-0 z-10 bg-black bg-opacity-75 w-full h-full"
    >
      <div
        ref={divRef}
        className="flex flex-col justify-center items-center h-full"
      >
        <div className="bg-white overflow-auto h-1/2 w-5/6 md:w-2/5 rounded-xl p-4">
          <div className="flex justify-between items-center mx-2 mb-10">
            <h1 className="font-medium font-sans text-gray-800 text-3xl">
              History
            </h1>
            <FaTimes
              size="2rem"
              className="cursor-pointer hover:text-yellow-400 transition duration-300"
              onClick={() => setOpenModal(false)}
            />
          </div>
          {Array.from({ length: 50 }).map((test, index) => {
            return (
              <div
                key={index}
                className="flex justify-between items-center py-2 md:p-2"
              >
                <div className="flex items-center bg-green-300 rounded-full pr-4">
                  <img
                    src="/images/profile.jpeg"
                    className="w-14 h-14 rounded-full"
                  />
                  <h1 className="md:text-xl font-bold md:py-2 px-1 md:px-4 text-green-800">
                    John Doe
                  </h1>
                  <p>10</p>
                </div>
                <span className="text-yellow-400 text-xl md:text-2xl font-bold">
                  VS
                </span>
                <div className="flex items-center bg-red-300 rounded-full pl-4">
                  <p>7</p>
                  <h1 className="md:text-xl font-bold md:py-2 px-1 md:px-4 text-red-800">
                    Saimon dave
                  </h1>
                  <img
                    src="/images/profile.jpeg"
                    className="w-14 h-14 rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
