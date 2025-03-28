import { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faEnvelope,
  faBell,
  faAngleDown,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";
import DropDown from "./sub/DropDown";
import Messenger from "./Messenger";
import NotificationBar from "./sub/NotificationBar";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

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
  }
  const handleNewNotificationsOpen = () => {
    setNotificationOpen(!isNotificationsOpen);
    setMessengerOpen(false);
    setDropOpen(false);
    setSearchOpen(false);
  }

  return (
    
    <header className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-900 p-4 shadow-md text-white sticky top-0 z-50">
      <div className="flex text-2xl font-bold tracking-wide text-center">
        <div>𝓛𝓸𝓰𝓸</div>
        <div className="flex-grow mx-4 max-w-[200px]">
          {screenWidth > 1000 ? (
            <input
              type="text"
              placeholder="Search..."
              className="w-full w-100px px-4 py-2 rounded-full border-none outline-none bg-gray-100 transition focus:bg-white focus:border-gray-300 text-sm text-black font-normal"
            />
          ) : (
            <FontAwesomeIcon
              icon={faSearch}
              onClick={() => setSearchOpen(!isSearchOpen)}
              className="cursor-pointer text-xl"
            />
          )}
        </div>
      </div>

      {/* Search Bar (Hidden on Mobile) */}

      {/* Menu */}
      {screenWidth > 700 ? (
        <nav className="flex gap-6 justify-center">
          <Link to="/">Home</Link>

          <Link to="#" className="hover:underline">
            Ride Request
          </Link>
          <Link to="#">Ride History</Link>
          <Link to="#" className="hover:underline">
            Complain
          </Link>
        </nav>
      ) : (
        <div className="flex justify-end">
          <button
            className="text-xl"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      )}

      {/* Desktop Icons */}

      <div className="flex items-center gap-6">
        <FontAwesomeIcon
          icon={faEnvelope}
          onClick={handleMessengerOpen}
          className="cursor-pointer text-2xl max-[640px]:text-lg transition-all duration-300 hover:text-gray-300 focus:text-gray-300 hover:scale-110"
        />
        {isMessengerOpen && <Messenger></Messenger>}
        <FontAwesomeIcon
          icon={faBell}
          onClick={handleNewNotificationsOpen}
          className="cursor-pointer text-2xl max-[640px]:text-lg transition-all duration-300 hover:text-gray-300 focus:text-gray-300 hover:scale-110"
        />
        {isNotificationsOpen && <NotificationBar></NotificationBar>}

        <Link to={`/${user?.id}`} className="relative">
          <div className="w-10 h-10 max-[640px]:w-8 max-[640px]:h-8 rounded-full p-[2px] bg-gradient-to-r from-blue-800 to-blue-500 transition-all hover:scale-110 focus:scale-105">
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
          className="cursor-pointer text-2xl max-[640px]:text-lg transition-all duration-300 hover:text-gray-300 focus:text-gray-300 hover:scale-110"
        />
      </div>
      {isDropOpen && <DropDown></DropDown>}

      {isMobileMenuOpen && (
        <div className="fixed top-[64px] left-0 w-full h-[calc(100vh-64px)] bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white text-black shadow-lg rounded-md p-8 flex flex-col gap-6 w-full h-full">
            <button
              className="absolute top-4 right-4 text-2xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              ✕
            </button>
            <Link
              to="#"
              className="text-lg text-center hover:bg-gray-200 p-4 rounded"
            >
              Ride Request
            </Link>
            <Link
              to="#"
              className="text-lg text-center hover:bg-gray-200 p-4 rounded"
            >
              Complain
            </Link>
            <Link to="#">Home</Link>
          </div>
        </div>
      )}

      {isSearchOpen && (
        <div className="fixed top-[34px] left-0 w-full h-[calc(100vh-64px)]   flex justify-center items-center z-50">
          <div className="bg-white text-black shadow-lg rounded-md p-8 w-full h-[80vh] flex flex-col items-center relative bg-opacity-90">
            <button
              className="absolute top-4 right-4 text-2xl"
              onClick={() => setSearchOpen(false)}
            >
              ✕
            </button>
            <input
              type="text"
              placeholder="Search..."
              className="w-[100%] max-w-lg px-4 py-3 rounded-full border-2 border-gray-300 outline-none bg-white text-lg text-black mt-4 shadow-md focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
            />

            <div className="results">No Search Results</div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
