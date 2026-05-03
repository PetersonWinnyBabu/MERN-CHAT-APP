import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";

// const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Chat = lazy(() => import("./pages/Chat.jsx"));
const Groups = lazy(() => import("./pages/Groups.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.jsx"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard.jsx"));
const ChatManagement = lazy(() => import("./pages/admin/ChatManagement.jsx"));
const MessagesManagement = lazy(
  () => import("./pages/admin/MessagesManagement.jsx"),
);
const UserManagement = lazy(() => import("./pages/admin/UserManagement.jsx"));
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import { LayoutLoader } from "./components/layout/Loaders.jsx";
import axios from "axios";
import { server } from "./constants/config.js";
import { useDispatch, useSelector } from "react-redux";
import { userExist, userNotExist } from "./redux/reducers/auth.js";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./socket.jsx";

const App = () => {
  const { user, loader } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) return;
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => {
        dispatch(userExist(data.user));
      })
      .catch(() => {
        dispatch(userNotExist());
      });
  }, [dispatch, user]);
  return loader ? (
    <LayoutLoader />
  ) : (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader />}>
        <SocketProvider>
          <Routes>
            <Route element={<ProtectedRoute logged={user} />}>
              <Route path="/" element={<Home />} />
              <Route path="/chat/:chatId" element={<Chat />} />
              <Route path="/groups" element={<Groups />} />
            </Route>

            <Route
              path="/login"
              element={
                <ProtectedRoute logged={!user} redirect="/">
                  <Login />
                </ProtectedRoute>
              }
            />

            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/chats" element={<ChatManagement />} />
            <Route path="/admin/messages" element={<MessagesManagement />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </SocketProvider>
      </Suspense>
      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
};

export default App;
