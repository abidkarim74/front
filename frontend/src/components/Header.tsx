import { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faEnvelope,
  faBell,
  faAngleDown,
  faSearch,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";
import DropDown from "./sub/DropDown";
import Messenger from "./Messenger";
import NotificationBar from "./sub/NotificationBar";
import { useTheme } from "../context/themeContext";
const Header: React.FC = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const { darkMode, toggleTheme } = useTheme(); // Get dark mode state and toggle function


  const [unreadCount, setUnreadCount] = useState(0);

  console.log("Count: ", unreadCount);

  const auth = useContext(AuthContext);
  if (!auth) return <div>Loading...</div>;
  const { user } = auth;

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [isSearchOpen, setSearchOpen] = useState<boolean>(false);
  const [isDropOpen, setDropOpen] = useState<boolean>(false);
  const [isMessengerOpen, setMessengerOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setNotificationOpen] = useState<boolean>(false);

  const handleMessengerOpen = () => {
    setMessengerOpen(!isMessengerOpen);
    setDropOpen(false);
    setSearchOpen(false);
    setNotificationOpen(false);
  };
  
  const handleNewNotificationsOpen = () => {
    setNotificationOpen(!isNotificationsOpen);
    setMessengerOpen(false);
    setDropOpen(false);
    setSearchOpen(false);
  };

  // Modern dark mode colors
  const headerBg = darkMode 
    ? "bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800"
    : "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-900";
  
  const textColor = darkMode ? "text-gray-100" : "text-white";
  const hoverTextColor = darkMode ? "hover:text-gray-300" : "hover:text-blue-200";
  const mobileMenuBg = darkMode ? "bg-gray-800" : "bg-white";
  const mobileMenuText = darkMode ? "text-gray-100" : "text-black";
  const searchInputBg = darkMode 
    ? "bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-100 focus:bg-gray-600 focus:border-blue-400"
    : "bg-gray-100 border-gray-300 placeholder-gray-400 text-gray-900 focus:bg-white focus:border-blue-500";

  return (
    <header className={`flex items-center justify-between ${headerBg} p-4 shadow-md ${textColor} sticky top-0 z-50`}>
      <div className="flex text-2xl font-bold tracking-wide text-center">
        <div>𝓛𝓸𝓰𝓸</div>
        <div className="flex-grow mx-4 max-w-[200px]">
          {screenWidth > 1000 ? (
            <input
              type="text"
              placeholder="Search..."
              className={`w-full max-w-xs px-3 py-2 rounded-full border ${searchInputBg} focus:ring-2 focus:ring-blue-300 outline-none shadow-sm transition-all duration-300 ease-in-out text-sm`}
            />
          ) : (
            <FontAwesomeIcon
              icon={faSearch}
              onClick={() => setSearchOpen(!isSearchOpen)}
              className={`cursor-pointer text-xl ${hoverTextColor}`}
            />
          )}
        </div>
      </div>

      {/* Menu */}
      {screenWidth > 700 ? (
        <nav className={`flex gap-6 justify-center ${textColor}`}>
          <Link to="/" className={`hover:underline ${hoverTextColor}`}>Home</Link>
          <Link to="#" className={`hover:underline ${hoverTextColor}`}>Ride Request</Link>
          <Link to="#" className={`hover:underline ${hoverTextColor}`}>Ride History</Link>
          <Link to="#" className={`hover:underline ${hoverTextColor}`}>Complain</Link>
        </nav>
      ) : (
        <div className="flex justify-end">
          <button
            className={`text-xl ${hoverTextColor}`}
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      )}

      {/* Desktop Icons */}
      <div className="flex items-center gap-6">
        {/* Dark mode toggle button */}
       

        <FontAwesomeIcon
          icon={faEnvelope}
          onClick={handleMessengerOpen}
          className={`cursor-pointer text-2xl max-[640px]:text-lg transition-all duration-300 ${hoverTextColor} hover:scale-110`}
        />
        {isMessengerOpen && <Messenger  />}
        
        <FontAwesomeIcon
          icon={faBell}
          onClick={handleNewNotificationsOpen}
          className={`cursor-pointer text-2xl max-[640px]:text-lg transition-all duration-300 ${hoverTextColor} hover:scale-110`}
        />
        {isNotificationsOpen && <NotificationBar setUnreadCount={setUnreadCount} />}

        <Link to={`/${user?.id}`} className="relative">
          <div className={`w-10 h-10 max-[640px]:w-8 max-[640px]:h-8 rounded-full p-[2px] ${darkMode ? 'bg-gradient-to-r from-gray-700 to-gray-500' : 'bg-gradient-to-r from-blue-800 to-blue-500'} transition-all hover:scale-110 focus:scale-105`}>
            <img
              src={user?.profilePic}
              alt="Profile"
              className="w-full h-full object-cover rounded-full border-2 border-transparent transition-all hover:border-blue focus:border-white hover:brightness-90 focus:brightness-90"
            />
          </div>
        </Link>

        <FontAwesomeIcon
          onClick={() => setDropOpen(!isDropOpen)}
          icon={faAngleDown}
          className={`cursor-pointer text-2xl max-[640px]:text-lg transition-all duration-300 ${hoverTextColor} hover:scale-110`}
        />
      </div>
      {isDropOpen && <DropDown />}

      {isMobileMenuOpen && (
        <div className="fixed top-[64px] left-0 w-full h-[calc(100vh-64px)] bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className={`${mobileMenuBg} ${mobileMenuText} shadow-lg rounded-md p-8 flex flex-col gap-6 w-full h-full`}>
            <button
              className={`absolute top-4 right-4 text-2xl ${mobileMenuText}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              ✕
            </button>
            <Link
              to="#"
              className={`text-lg text-center ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} p-4 rounded`}
            >
              Ride Request
            </Link>
            <Link
              to="#"
              className={`text-lg text-center ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} p-4 rounded`}
            >
              Complain
            </Link>
            <Link 
              to="#" 
              className={`text-lg text-center ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} p-4 rounded`}
            >
              Home
            </Link>
            {/* Dark mode toggle in mobile menu */}
            <button
              onClick={toggleTheme}
              className={`text-lg text-center ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} p-4 rounded flex items-center justify-center gap-2`}
            >
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      )}

      {isSearchOpen && (
        <div className="fixed top-[34px] left-0 w-full h-[calc(100vh-64px)] flex justify-center items-center z-50">
          <div className={`${mobileMenuBg} ${mobileMenuText} shadow-lg rounded-md p-8 w-full h-[80vh] flex flex-col items-center relative ${darkMode ? 'bg-opacity-95' : 'bg-opacity-90'}`}>
            <button
              className={`absolute top-4 right-4 text-2xl ${mobileMenuText}`}
              onClick={() => setSearchOpen(false)}
            >
              ✕
            </button>
            <input
              type="text"
              placeholder="Search..."
              className={`w-[100%] max-w-lg px-4 py-3 rounded-full border-2 ${darkMode ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-400' : 'border-gray-300 bg-white text-black focus:border-blue-500'} outline-none text-lg mt-4 shadow-md focus:ring-2 focus:ring-blue-300`}
            />

            <div className="results">No Search Results</div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;