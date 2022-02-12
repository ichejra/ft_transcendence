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
        <div className="bg-white w-5/6 md:w-1/3 rounded-xl py-4">
          <div className="flex justify-between items-center mx-2 mb-8 px-2 text-gray-700 bg-white">
            <h1 className="font-medium font-sans text-3xl">
              Unfriend firstname lastname
            </h1>
            <FaTimes
              size="2rem"
              className="cursor-pointer hover:text-yellow-400 transition duration-300"
              onClick={() => setOpenModal(false)}
            />
          </div>
          <hr />
          <div className="mx-4 my-2">
            <p className="text-xl">
              Are you sure you want to remove{" "}
              <strong>Firstname Lastname</strong> as your friend?
            </p>
            <div className="flex justify-end mt-8">
              <button
                onClick={() => setOpenModal(false)}
                className="hover:bg-gray-100 bg-gray-200 font-bold px-4 py-2 mr-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => setOpenModal(false)}
                className="hover:bg-yellow-300 bg-yellow-400 font-bold px-4 py-2 mr-2 rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersModal;
