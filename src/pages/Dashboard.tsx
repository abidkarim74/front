import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import RidePosts from "../components/RidePosts";
import { useTheme } from "../context/themeContext";
import HomeRightBar from "../components/HomeRightBar";
import HomeLeftBar from "../components/HomeLeftBar";

const Dashboard = () => {
  const { darkMode } = useTheme(); 
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="mt-2 p-6 shadow-xl rounded-2xl border" 
    >
      {/* Menu Button for Small Screens */}
      <div className="sm:hidden relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition duration-300 focus:ring focus:ring-blue-300"
        >
          <FontAwesomeIcon
            icon={faBars}
            className="w-5 h-5"
          />
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-white  shadow-md rounded-lg py-2 border z-10">
            <Link
              to="/ride-history"
              className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Ride History
            </Link>
            <Link
              to="/ride-pending"
              className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Pending Requests
            </Link>
          </div>
        )}
      </div>

      {/* Layout Container */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mt-4">
        {/* Left Sidebar */}
        <div className="hidden sm:block col-span-1">
          <HomeLeftBar />
        </div>

        {/* Main Content */}
        <div className="col-span-2">
          <div className="flex flex-col sm:flex-row justify-center items-center mb-6 gap-4">
            <Link
              to="/make-ride-request"
              className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition duration-300 focus:ring focus:ring-green-300"
            >
              Make Ride Post
            </Link>
          </div>
          <RidePosts />
        </div>

        {/* Right Sidebar */}
        <div className="hidden sm:block col-span-1">
          <HomeRightBar />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
