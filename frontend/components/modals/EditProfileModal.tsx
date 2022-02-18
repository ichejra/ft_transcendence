import { useRef } from "react";
import { FaTimes } from "react-icons/fa";

interface Props {
  setEditProfile: (a: boolean) => void;
}

const UsersModal: React.FC<Props> = ({ setEditProfile }) => {
  const divRef = useRef(null);

  return (
    <div
      onClick={(e) => {
        if (e.target == divRef.current) setEditProfile(false);
      }}
      className="fixed top-0 left-0 z-10 bg-black bg-opacity-75 w-full h-full"
    >
      <div
        ref={divRef}
        className="flex flex-col justify-center items-center h-full"
      >
        <div className="bg-white w-5/6 md:w-1/3 rounded-xl py-4">
          <div className="flex justify-between items-center mx-2 mb-8 px-2 text-gray-700 bg-white">
            <h1 className="font-medium font-sans text-3xl">Edit profile</h1>
            <FaTimes
              size="2rem"
              className="cursor-pointer hover:text-yellow-400 transition duration-300"
              onClick={() => setEditProfile(false)}
            />
          </div>
          <hr />
          <div className="mx-4 my-2">
            <form className="flex flex-col justify-center p-8 space-y-6">
              <div className="flex justify-center">
                <label
                  className="relative w-44 h-44 rounded-full hover:opacity-50 cursor-pointer"
                  htmlFor="avatar"
                >
                  <img
                    className="absolute flex items-center justify-center w-44 h-44 rounded-full border border-gray-800 bg-center bg-cover"
                    src="/images/profile.jpeg"
                    id="profile-picture"
                  />
                  <p className="absolute text-gray-200 w-full h-full flex items-center justify-center rounded-full font-bold text-2xl tracking-wider">
                    change
                  </p>
                </label>
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/*"
                  className="hidden p-4 rounded-md m-2 tracking-wider text-gray-800"
                />
              </div>
              <div className="flex flex-col">
                <input
                  type="text"
                  id="username"
                  name="username"
                  autoComplete="off"
                  placeholder="username"
                  className={`p-4 rounded-md m-2 tracking-wider border-2 border-red-400`}
                  maxLength={12}
                  title="Characters from a - z | A - Z | 0 - 9"
                />
                <p
                  className={`text-sm mx-2 text-red-400  block
                  }`}
                >
                  Username must be lowercase including numbers and '_' and
                  contain 5 - 12 characters
                </p>
              </div>
              <div className="flex flex-col">
                <button
                  onClick={() => setEditProfile(false)}
                  className="hover:bg-yellow-300 bg-yellow-400 font-bold px-4 py-2 mr-2 mb-2 rounded-lg"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditProfile(false)}
                  className="hover:bg-gray-100 bg-gray-200 font-bold px-4 py-2 mr-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersModal;
