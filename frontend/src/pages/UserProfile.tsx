import { useParams } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useContext, useState, useEffect } from "react";
import { getRequest } from "../services/apiRequests";
import { Link } from "react-router-dom";
import { UserProfileData } from "../interfaces/profileInterfaces";

const UserProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext is undefined. Make sure you are using ProtectedRoute within an AuthProvider.");
  }
  const { accessToken } = authContext;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const userData = await getRequest(`/general/profile/${userId}`, accessToken, setLoading, setError);
        setProfile(userData);
      } catch (error) {
        setError("Failed to fetch user profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, accessToken]);

  if (loading)
    return <p className="loading-text">Loading...</p>;
  if (error)
    return <p className="error-text">{error}</p>;

  return (
    <section className="user-profile">
      {profile ? (
        <div className="profile-container">
          <img
            src={profile.profilePic || "/default-profile.png"}
            alt={`${profile.fullname || "User"}'s Profile`}
            className="profile-pic"
          />
          <Link to={`/${userId}/update`}>Update</Link>
          <Link to="#">Remove</Link>
          <h2 className="profile-name">{profile.fullname}</h2>
          <p className="profile-username">@{profile.username}</p>
          <p className="profile-email">{profile.email}</p>

          <div className="profile-info">
            <p><strong>Gender:</strong> {profile.gender}</p>
            <p><strong>Type:</strong> {profile.type}</p>
            <p><strong>Admin:</strong> {profile.isAdmin ? "Yes" : "No"}</p>
            <p><strong>Phone:</strong> {profile.phone ? profile.phone : "N/A"}</p>
            <p><strong>Rating:</strong> ⭐ {profile.rating}/5</p>

            {profile.vehiclePic && (
              <div className="vehicle-section">
                <p className="vehicle-title">Vehicle Picture:</p>
                <img
                  src={profile.vehiclePic}
                  alt="Vehicle"
                  className="vehicle-pic"
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="not-found">User not found</p>
      )}
    </section>
  );
};

export default UserProfile;
