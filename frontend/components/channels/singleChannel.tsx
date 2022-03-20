import { useParams } from "react-router";

const SingleChannel: React.FC = () => {
  const { id } = useParams();
  return (
    <div className="relative text-white ml-6 left-[7.4rem]">
      <div className="fixed user-card-bg border-b border-l border-gray-700 shadow-gray-700 shadow-sm left-[7.4rem] text-white p-2 w-full">
        channel {id}
      </div>
      <div className="mt-12">
        {Array.from({ length: 30 }).map((item, index) => {
          return (
            <div className="my-8 mr-2 flex about-family items-center">
              <img
                src="/images/profile.jpeg"
                className="w-10 h-10 rounded-full mr-2"
              />
              <div>
                <p className="text-gray-300">
                  elahyani{" "}
                  <span className="text-gray-500 text-xs">
                    {new Date().toLocaleString("default", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </p>
                <p className="text-xs">
                  accusamus nostrum reiciendis eveniet, rem aliquid corporis
                  blanditiis itaque porro recusandae sunt. Voluptate, alias
                  sequi.
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SingleChannel;
