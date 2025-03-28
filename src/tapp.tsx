import React, { useContext, useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import UpdateProfile from "./pages/UpdateProfile";
import LoginForm from "./pages/Login";
import ProtectedRoute from "./context/ProtectedRoutes";
import UserProfile from "./pages/UserProfile";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Header from "./components/Header";
import { AuthContext } from "./context/authContext";
import CreateRidePost from "./pages/CreateRidePost";
import { useTheme } from "./context/themeContext";
import { useSocketContext } from "./context/socketContext";
import UnauthenticatedHeader from "./components/UnauthenticatedHeader";

const App: React.FC = () => {
  const auth = useContext(AuthContext);
  const { darkMode } = useTheme(); 

  const { socket, onlineUsers } = useSocketContext();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
      if (!socket) return;
  
      const handleNewNotifications = (newNotification: any) => {
        console.log(newNotification);
      };
  
      socket.on("newNotification", handleNewNotifications);
  
      return () => {
        socket.off("newNotification", handleNewNotifications);
      };
    }, [socket]);

  if (!auth) return <div>Loading...</div>;
  const { user } = auth;

  console.log("User: ", user);


  return (
    <div>
      {user ? <Header /> : <UnauthenticatedHeader></UnauthenticatedHeader>}
      {/* {user && <Header></Header>}       */}
      <div className="">
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/make-ride-request" element={<ProtectedRoute><CreateRidePost /></ProtectedRoute>} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
          <Route path="/login" element={!user ? <LoginForm /> : <Navigate to="/" />} />
          <Route path="/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/:userId/update" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
