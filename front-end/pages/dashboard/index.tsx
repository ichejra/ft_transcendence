import { NextPage } from "next";
import { useAppSelector } from "../../app/hooks";

const Dashboard: NextPage = () => {
  const { isLoggedIn, isAdmin } = useAppSelector((state) => state.loginStatus);

  if (isAdmin) {
    return (
      <div className="page-100 flex items-center justify-center">
        <h1 className="text-2xl">Dashboard</h1>
      </div>
    );
  }
  return <div className="page-100"></div>;
};

export default Dashboard;
