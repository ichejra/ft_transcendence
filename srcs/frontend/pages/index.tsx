import type { NextPage } from "next";
import { Routes, Route } from "react-router-dom";
import HomePage from "../components/home";
import Channels from "../components/channels";
import DirectChat from "../components/chat/DirectChat";
import PongGame from "../components/game";
import AllUsers from "../components/users";
import UserProfile from "../components/profile/Profile";
import Login from "../components/auth/Login";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NotFound from "../components/NotFound";
import { AuthRoute, CompleteProfile } from "../components/privateRoutes";
import CompleteUserProfileInfo from "../components/auth/CompleteUserProfileInfo";
import VerificationPage from "../components/auth/VerificationPage";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { useEffect, useState } from "react";
import { fetchCurrentUser } from "../features/userProfileSlice";
import Cookies from "js-cookie";
import Head from "next/head";
import LiveGames from "../components/liveGames";
import SocketProvider from "./SocketProvider";

const Home: NextPage = () => {
  const { isLoggedIn } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (Cookies.get("accessToken")) {
      dispatch(fetchCurrentUser());
    }
  }, []);

  if (Cookies.get("accessToken") && !isLoggedIn) {
    return <div className="loading w-32 h-32"></div>;
  }

  return (
    <SocketProvider>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Fredoka+One&display=swap"
          rel="stylesheet"
        />
        <title>Ping pong</title>
      </Head>
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
          path="/channels/:id"
          element={
            <AuthRoute>
              <CompleteProfile>
                <Channels />
              </CompleteProfile>
            </AuthRoute>
          }
        />
        <Route
          path="/direct"
          element={
            <AuthRoute>
              <CompleteProfile>
                <DirectChat />
              </CompleteProfile>
            </AuthRoute>
          }
        />
        <Route
          path="/direct/:id"
          element={
            <AuthRoute>
              <CompleteProfile>
                <DirectChat />
              </CompleteProfile>
            </AuthRoute>
          }
        />
        <Route
          path="/game"
          element={
            <AuthRoute>
              <CompleteProfile>
                <PongGame userType="player" />
              </CompleteProfile>
            </AuthRoute>
          }
        />
        <Route
          path="/watch"
          element={
            <AuthRoute>
              <CompleteProfile>
                <PongGame userType="spectator" />
              </CompleteProfile>
            </AuthRoute>
          }
        />
        <Route
          path="/users"
          element={
            <AuthRoute>
              <CompleteProfile>
                <AllUsers type="users" />
              </CompleteProfile>
            </AuthRoute>
          }
        />
        <Route
          path="/users/:id/friends"
          element={
            <AuthRoute>
              <CompleteProfile>
                <AllUsers type="friends" />
              </CompleteProfile>
            </AuthRoute>
          }
        />
        <Route
          path="/users/:id/blocked"
          element={
            <AuthRoute>
              <CompleteProfile>
                <AllUsers type="blockedUsers" />
              </CompleteProfile>
            </AuthRoute>
          }
        />
        <Route
          path="/liveGames"
          element={
            <AuthRoute>
              <CompleteProfile>
                <LiveGames />
              </CompleteProfile>
            </AuthRoute>
          }
        />
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
        <Route path="/verify-page" element={<VerificationPage />}></Route>
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
    </SocketProvider>
  );
};

export default Home;
