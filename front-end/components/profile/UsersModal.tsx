import Link from "next/link";
import { useRef } from "react";
import { FaTimes } from "react-icons/fa";

interface Props {
  setOpenModal: (a: boolean) => void;
}

const UsersModal: React.FC<Props> = ({ setOpenModal }) => {
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
        <div className="bg-white overflow-auto h-1/2 w-1/3 rounded-xl py-4">
          <div className="flex justify-between items-center mx-2 mb-10 px-2 text-gray-700 bg-white">
            <h1 className="font-medium font-sans text-3xl">Friends</h1>
            <FaTimes
              size="2rem"
              className="cursor-pointer hover:text-yellow-400 transition duration-300"
              onClick={() => setOpenModal(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersModal;
