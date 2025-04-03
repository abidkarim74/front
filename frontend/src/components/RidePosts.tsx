import { getRequest, postRequest } from "../services/apiRequests";
import { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/themeContext"; // Import the theme context

const RidePosts = () => {
  const auth = useContext(AuthContext);
  const { darkMode } = useTheme(); // Properly use the theme context
  if (!auth) return null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [notification, setNotification] = useState<string>("You got a notification");
  
  const url = "/rides/ride-requests";
  const postUrl = "/notifications/create";

  const fetchRidePosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const response = await getRequest(url, auth.accessToken, setLoading, setError);
    if (response) setPosts(response);
  }, [auth.accessToken]);

  useEffect(() => {
    fetchRidePosts();
  }, [fetchRidePosts]);

  const handleAccept = useCallback(async (postId: string, posterId: string) => {
    const response = await postRequest(
      { userId: posterId, message: notification },
      postUrl,
      auth.accessToken,
      setLoading,
      setError
    );
    if (response) {
      console.log("Notification sent!");
    }
  }, [auth.accessToken, notification]);

  // Dynamic styles based on dark mode
  const containerStyles = darkMode
    ? "bg-gray-800 text-gray-100 border-gray-700"
    : "bg-white text-gray-900 border-gray-200";

  const postCardStyles = darkMode
    ? "bg-gray-700/80 border-gray-600 hover:shadow-gray-800"
    : "bg-white/80 border-gray-300 hover:shadow-xl";

  const textStyles = darkMode
    ? "text-gray-100"
    : "text-gray-800";

  const secondaryTextStyles = darkMode
    ? "text-gray-300"
    : "text-gray-500";

  return (
    <div className={`max-w-3xl mx-auto p-8 rounded-3xl shadow-2xl border ${containerStyles}`}>
      <h3 className={`text-3xl font-bold mb-6 text-center ${textStyles}`}>🚗 Ride Requests</h3>
      
      {loading && (
        <div className="text-center">
          <div className={`animate-spin rounded-full h-10 w-10 border-t-4 ${darkMode ? 'border-blue-400' : 'border-blue-500'} mx-auto`}></div>
        </div>
      )}
      {error && (
        <div className={`text-center ${darkMode ? 'text-red-400' : 'text-red-500'}`}>
          <p>Error: {error}</p>
          <button 
            onClick={fetchRidePosts} 
            className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} underline`}
          >
            Retry
          </button>
        </div>
      )}
      {successMessage && (
        <p className={`text-center font-semibold ${darkMode ? 'text-green-400' : 'text-green-500'}`}>
          {successMessage}
        </p>
      )}

      {posts && posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => {
            const buttonStyles = darkMode
              ? post.isAccepted
                ? "bg-gray-600 cursor-not-allowed opacity-70"
                : "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
              : post.isAccepted
                ? "bg-gray-400 cursor-not-allowed opacity-70"
                : "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800";

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`relative overflow-hidden rounded-2xl p-6 border backdrop-blur-lg shadow-lg hover:shadow-2xl transition-all duration-300 ${postCardStyles}`}
              >
                <Link to="#" className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={post.poster.profilePic}
                      alt={post.poster.username}
                      className={`w-16 h-16 rounded-full border-2 ${darkMode ? 'border-blue-400' : 'border-blue-500'} shadow-sm`}
                    />
                    <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div>
                    <span className={`font-semibold text-lg ${textStyles}`}>{post.poster.username}</span>
                    <small className={`block ${secondaryTextStyles}`}>
                      {new Date(post.time).toLocaleString()}
                    </small>
                  </div>
                </Link>

                <div className={`mt-4 space-y-2 ${textStyles}`}>
                  <h4 className="font-semibold text-lg">
                    📍 Pickup: <span className="font-normal">{post.pickLocation}</span>
                  </h4>
                  <h4 className="font-semibold text-lg">
                    🎯 Drop: <span className="font-normal">{post.dropLocation}</span>
                  </h4>
                  <h3 className={`text-2xl font-bold mt-3 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    💰 Fare: Rs. {post.cost}
                  </h3>
                </div>

                <button
                  onClick={() => handleAccept(post.id, post.poster.id)}
                  className={`w-full py-3 mt-5 rounded-full font-semibold text-white text-lg transition-all shadow-lg hover:scale-105 hover:shadow-xl ${buttonStyles}`}
                  disabled={post.isAccepted}
                >
                  {post.isAccepted ? "Not Available" : "✅ Accept Ride"}
                </button>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <p className={`text-center text-lg ${secondaryTextStyles}`}>
          No ride requests available.
        </p>
      )}
    </div>
  );
};

export default RidePosts;