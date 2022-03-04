import type { NextPage } from "next";
import { Routes, Route } from "react-router-dom";
import HomePage from "../components/home";
import About from "../components/about";
import Channels from "../components/channels";
import PongGame from "../components/game";
import AllUsers from "../components/users";
import UserProfile from "../components/profile/Profile";
import Login from "../components/auth/Login";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FullFriendsList from "../components/profile/FullFriendsList";
import NotFound from "../components/NotFound";
import { AuthRoute, CompleteProfile } from "../components/privateRoutes";
import CompleteUserProfileInfo from "../components/auth/CompleteUserProfileInfo";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { useEffect } from "react";
import { fetchAllUsers, fetchCurrentUser } from "../features/userProfileSlice";
import Cookies from "js-cookie";
const Home: NextPage = () => {
  const { isLoggedIn } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (Cookies.get("jwt")) {
      dispatch(fetchCurrentUser());
      dispatch(fetchAllUsers());
    }
  }, []);

  if (Cookies.get("jwt") && !isLoggedIn) {
    return <div className="loading"></div>;
  }
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/channels"
          element={
            <AuthRoute>
              <CompleteProfile>
                <Channels />
              </CompleteProfile>
            </AuthRoute>
          }
        />
        <Route
          path="/game"
          element={
            <AuthRoute>
              <CompleteProfile>
                <PongGame />
              </CompleteProfile>
            </AuthRoute>
          }
        />
        <Route
          path="/users"
          element={
            <AuthRoute>
              <CompleteProfile>
                <AllUsers />
              </CompleteProfile>
            </AuthRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/profile/:id"
          element={
            <AuthRoute>
              <CompleteProfile>
                <UserProfile />
              </CompleteProfile>
            </AuthRoute>
          }
        ></Route>
        <Route
          path="/profile/:id/list"
          element={
            <AuthRoute>
              <CompleteProfile>
                <FullFriendsList />
              </CompleteProfile>
            </AuthRoute>
          }
        />
        <Route
          path="/complete-info"
          element={
            <AuthRoute>
              <CompleteUserProfileInfo />
            </AuthRoute>
          }
        />
        <Route path="/auth" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
};

export default Home;
