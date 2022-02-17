import type { NextPage } from "next";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../components/home";
import About from "../components/about";
import Channels from "../components/channels";
import PongGame from "../components/game";
import Dashboard from "../components/dashboard";
import UserProfile from "../components/profile/Profile";
import Login from "../components/auth/Login";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EditProfile from "../components/profile/EditProfile";
import FullFriendsList from "../components/profile/FullFriendsList";
import NotFound from "../components/NotFound";
import {
  AuthRoute,
  CompleteProfile,
  AdminRoute,
} from "../components/privateRoutes";
import CompleteUserProfileInfo from "../components/auth/CompleteUserProfileInfo";

const Home: NextPage = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/channels"
          element={
            <AuthRoute>
              <Channels />
            </AuthRoute>
          }
        />
        <Route
          path="/game"
          element={
            <AuthRoute>
              <CompleteProfile>
                <AdminRoute>
                  <PongGame />
                </AdminRoute>
              </CompleteProfile>
            </AuthRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/dashboard"
          element={
            <AuthRoute>
              <CompleteProfile>
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              </CompleteProfile>
            </AuthRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <AuthRoute>
              <UserProfile />
            </AuthRoute>
          }
        ></Route>
        <Route
          path="/profile/:id/list"
          element={
            <AuthRoute>
              <FullFriendsList />
            </AuthRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <AuthRoute>
              <EditProfile />
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
