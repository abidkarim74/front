import { motion } from "framer-motion";
import { useTheme } from "../context/themeContext"; // Import the theme context

const HomeRightBar = () => {
  const { darkMode } = useTheme(); // Get dark mode state
  const rideHistory = [
    { id: 1, from: "Downtown", to: "City Center", date: "March 25, 2025" },
    { id: 2, from: "Airport", to: "University", date: "March 24, 2025" },
    { id: 3, from: "Mall", to: "Downtown", date: "March 22, 2025" }
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

  return (
    <div className={`shadow-lg rounded-2xl p-4 border max-w-sm w-full ${containerStyles}`}>
      <h3 className={`text-lg font-semibold mb-4 ${textStyles}`}>📅 Ride History - Last 7 Days</h3>
      <ul className="space-y-3">
        {rideHistory.length > 0 ? (
          rideHistory.map((ride) => (
            <motion.li
              key={ride.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-3 rounded-lg flex justify-between items-center transition-colors ${listItemStyles}`}
            >
              <div>
                <p className={`font-medium ${textStyles}`}>From: {ride.from}</p>
                <p className={`font-medium ${textStyles}`}>To: {ride.to}</p>
                <p className={`text-sm ${secondaryTextStyles}`}>{ride.date}</p>
              </div>
            </motion.li>
          ))
        ) : (
          <p className={`text-center ${secondaryTextStyles}`}>
            No rides in the last 7 days.
          </p>
        )}
      </ul>
    </div>
  );
};

export default HomeRightBar;