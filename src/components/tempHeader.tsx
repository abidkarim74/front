import { useState, useContext } from "react";
import { FaEnvelope, FaBell, FaUserCircle, FaSun, FaMoon } from "react-icons/fa";
import { AuthContext } from "../context/authContext";
import Messenger from "./Messenger";
import DropDown from "./sub/DropDown";
import NotificationBar from "./sub/NotificationBar";
import { useTheme } from "../context/themeContext";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const [isMessengerOpen, setMessengerOpen] = useState(false);
  const [isDropOpen, setDropOpen] = useState(false);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);

  const auth = useContext(AuthContext);
  if (!auth) return <div>Loading...</div>;

  const { user } = auth;
  const { darkMode, toggleTheme } = useTheme(); 

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-50 transition duration-300">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo and Search */}
        <div className="flex items-center space-x-6">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            CampusCarawan
          </h2>
          <form
            className={`hidden md:block transition-all duration-300 ease-in-out ${
              isSearchVisible ? "block" : "hidden"
            }`}
          >
            <input
              type="text"
              placeholder="Search for ride posts..."
              className="px-4 py-2 w-72 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </form>
          <button
            onClick={() => setSearchVisible(!isSearchVisible)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12H9m0 0H5m4 0h6m0 0h4"
              />
            </svg>
          </button>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-6">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-blue-400 transition duration-200"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <FaSun className="w-6 h-6" /> : <FaMoon className="w-6 h-6" />}
          </button>

          {/* Messenger Icon */}
          <button
            onClick={() => setMessengerOpen(!isMessengerOpen)}
            className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 transition duration-200"
          >
            <FaEnvelope className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
              3
            </span>
          </button>

          {/* Notifications Icon */}
          <button
            onClick={() => setNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 transition duration-200"
          >
            <FaBell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
              5
            </span>
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setDropOpen(!isDropOpen)}
              className="flex items-center space-x-3 focus:outline-none"
            >
              {user?.profilePic ? (
                <Link to={`/${user.id}`}>
                  <img
                  src={user.profilePic}
                  alt={`${user.fullname}'s profile`}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 transition duration-200"
                />
                </Link>
                
              ) : (
                <FaUserCircle className="w-10 h-10 text-gray-700 dark:text-gray-300 hover:text-blue-400 transition duration-200" />
              )}
              <span className="hidden md:block text-lg text-gray-900 dark:text-gray-300 font-semibold">
                {user?.fullname}
              </span>
            </button>
            {isDropOpen && <DropDown />}
          </div>
        </div>
      </div>

      {isMessengerOpen && <Messenger />}
      {isNotificationsOpen && <NotificationBar></NotificationBar>}
    </header>
  );
};

export default Header;
