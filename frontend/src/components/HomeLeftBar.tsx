import { motion } from "framer-motion";
import { useTheme } from "../context/themeContext"; // Import the theme context

const HomeLeftBar = () => {
  const { darkMode } = useTheme(); // Get dark mode state
  const rideRequests = [
    { id: 1, name: "John Doe", location: "Downtown", time: "10:30 AM" },
    { id: 2, name: "Jane Smith", location: "Airport", time: "11:00 AM" },
    { id: 3, name: "Alice Johnson", location: "City Center", time: "11:45 AM" }
  ];

  // Dynamic styles based on dark mode
  const containerStyles = darkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";

  const textStyles = darkMode
    ? "text-gray-100"
    : "text-gray-800";

  const secondaryTextStyles = darkMode
    ? "text-gray-300"
    : "text-gray-500";

  const listItemStyles = darkMode
    ? "bg-gray-700 hover:bg-gray-600"
    : "bg-gray-100 hover:bg-gray-200";

  const buttonStyles = darkMode
    ? "bg-blue-600 hover:bg-blue-700"
    : "bg-blue-500 hover:bg-blue-600";

  return (
    <div className={`shadow-lg rounded-2xl p-4 border max-w-xs w-full overflow-y-auto max-h-80 ${containerStyles}`}>
      <h3 className={`text-lg font-semibold mb-4 ${textStyles}`}>🚗 Pending Ride Requests</h3>
      <ul className="space-y-3">
        {rideRequests.map((request) => (
          <motion.li
            key={request.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-3 rounded-lg flex justify-between items-center transition-colors ${listItemStyles}`}
          >
            <div>
              <p className={`font-medium ${textStyles}`}>{request.name}</p>
              <p className={`text-sm ${secondaryTextStyles}`}>
                {request.location} • {request.time}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`text-white px-3 py-1 rounded-lg text-sm transition ${buttonStyles}`}
            >
              Accept
            </motion.button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default HomeLeftBar;