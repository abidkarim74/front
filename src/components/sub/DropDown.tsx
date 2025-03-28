import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { logoutUser } from "../../services/authServices";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/themeContext"; // Assuming you have a theme context

const DropDown = () => {
  const auth = useContext(AuthContext);
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(false);

  if (!auth) return <div className="text-gray-500">Loading...</div>;

  const { accessToken, setUser } = auth;

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser(setUser, accessToken);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
    className="absolute top-full right-3 border border-gray-200 rounded-lg shadow-lg py-2 z-50
    w-[95%] sm:w-[20%] bg-white text-gray-900"
  >
    <Link
      to="#"
      className="block px-4 py-2 hover:bg-gray-100 transition duration-200"
    >
      Settings
    </Link>
    <Link
      to="#"
      className="block px-4 py-2 hover:bg-gray-100 transition duration-200"
    >
      Update
    </Link>
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full text-left px-4 py-2 transition duration-200 text-red-600 hover:bg-red-100 disabled:opacity-50"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  </div>
  
  );
};

export default DropDown;
