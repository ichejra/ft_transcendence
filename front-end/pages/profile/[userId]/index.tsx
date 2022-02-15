import { NextPage } from "next";
import withAuth from "../../../components/auth/withAuth";

import {
  ProfileHeader,
  ProfileInfo,
  FriendsList,
} from "../../../components/profile";

const UserProfile: NextPage = () => {
  return (
    <div className="page-100 flex justify-center lg:py-12">
      <div className="flex flex-col w-full lg:w-5/6 items-center border-2 shadow-xl rounded-3xl bg-white">
        <ProfileHeader />
        <hr className="w-5/6 h-4" />
        <div className="flex flex-col lg:flex-row justify-center w-full">
          <ProfileInfo />
          <FriendsList />
        </div>
      </div>
    </div>
  );
};

// interface Params {
//   userId: string;
// }

// export const getServerSideProps: GetServerSideProps<Props> = async ({
//   params,
// }) => {
//   const response = await fetch(
//     `https://dummyapi.io/data/v1/user/${params?.userId}`,
//     {
//       method: "GET",
//       headers: { "app-id": "6207d95d0d83d3b8d0e20499" },
//     }
//   );
//   const user = await response.json();
//   return {
//     props: {
//       user,
//     },
//   };
// };

export default withAuth(UserProfile);
