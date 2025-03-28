import { getRequest, postRequest } from "../services/apiRequests";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";
import { useTheme } from "../context/themeContext";


const RidePosts = () => {
  const auth = useContext(AuthContext);
  const { darkMode } = useTheme(); 
  if (!auth) return null;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);
  const [posts, setPosts] = useState<any[] | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const url = "/rides/ride-requests";
  const postUrl = "/rides/accept-request";

  useEffect(() => {
    const fetchRidePosts = async () => {
      setLoading(true);
      setError(null);

      const response = await getRequest(url, auth.accessToken, setLoading, setError);

      if (response) {
        setPosts(response);
      }
    };

    fetchRidePosts();
  }, [auth.accessToken]);

  const handleAccept = async (postId: string) => {
    const response = await postRequest({ id: postId }, postUrl, auth.accessToken, setLoading, setError);

    if (response) {
      setSuccessMessage("Ride accepted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);

      setPosts((prevPosts) =>
        prevPosts ? prevPosts.map((post) => (post.id === postId ? { ...post, isAccepted: true } : post)) : null
      );
    }
  };

  return (
    <div
      className="max-w-3xl mx-auto p-4 rounded-lg shadow-lg border "
    >
      <h3 className="text-2xl font-semibold mb-4">
        Ride Requests
      </h3>

      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

      {posts && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className={`shadow-md rounded-lg p-4 border ${
                darkMode
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-gray-100 text-gray-900 border-gray-400"
              }`}
            >
              <Link to="#" className="flex items-center gap-3">
                <img
                  src={post.poster.profilePic}
                  alt={post.poster.username}
                  className="w-10 h-10 rounded-full border border-gray-600"
                />
                <div>
                  <span className="font-semibold">{post.poster.username}</span>
                  <small className="block text-gray-400">{new Date(post.time).toLocaleString()}</small>
                </div>
              </Link>

              <div className="mt-4">
                <h4>
                  <span className="font-semibold">Pickup:</span> {post.pickLocation}
                </h4>
                <h4>
                  <span className="font-semibold">Drop:</span> {post.dropLocation}
                </h4>
                <h3 className="text-lg font-bold text-green-500 mt-2">
                  Fare: Rs. {post.cost}
                </h3>
              </div>

              <button
                onClick={() => handleAccept(post.id)}
                className={`w-full py-2 mt-4 rounded-lg font-semibold text-white transition-all ${
                  post.isAccepted
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={post.isAccepted}
              >
                {post.isAccepted ? "Not Available" : "Accept Ride"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No ride requests available.</p>
      )}
    </div>
  );
};

export default RidePosts;
