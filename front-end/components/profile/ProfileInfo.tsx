const ProfileInfo: React.FC = () => {
  return (
    <div className="h-96 mr-16 w-1/3">
      <h1 className="text-xl font-bold">Game history</h1>
      <div className="border-2 rounded-lg border-yellow-400 p-4">
        {Array.from({ length: 20 }).map((test) => {
          return (
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold py-2 px-4 text-green-500">
                John Doe
              </h1>
              <span className="text-yellow-400 text-2xl font-bold">VS</span>
              <h1 className="text-xl font-bold py-2 px-4 text-red-500">
                Saimon dave
              </h1>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileInfo;
