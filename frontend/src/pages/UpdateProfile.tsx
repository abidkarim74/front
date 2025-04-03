import { getRequest } from "../services/apiRequests";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { UserProfileData } from "../interfaces/profileInterfaces";

const UpdateProfile = () => {
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  console.log(user);
  
  const params = useParams();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext is undefined. Ensure you are using ProtectedRoute within an AuthProvider.");
  }

  const { accessToken } = authContext;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!params.userId) return;
      setLoading(true);
      
        const userData = await getRequest(`/general/profile/${params.userId}`, accessToken,setLoading, setError);
        setUser(userData);
      
    };

    fetchUserData();
  }, [params.userId, accessToken]);

  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profilePic || !params.userId) return;
  
    const formData = new FormData();
    formData.append("profilePic", profilePic);

    
  
    try {
      setLoading(true);
      const response = await fetch(`https://deploy1-production-8cf4.up.railway.app/update/uploads-profilepic/${params.userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`, 
        },
        body: formData, 
      });
  
      const data = await response.json();
      if (response.ok) {
        setUser((prev) => prev ? { ...prev, profilePic: data.profilePic } : null);
        alert("Profile picture updated successfully!");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to update profile picture");
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName && !phoneNumber) {
      alert("Enter at least one field to update!");
      return;
    }
  
    try {
      setLoading(true);
      const response = await fetch(`/api/profile/details/${params.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ fullName, phoneNumber }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setUser((prev) =>
          prev ? { ...prev, fullName: data.updatedData.fullName, phoneNumber: data.updatedData.phoneNumber } : null
        );
        alert("Profile details updated successfully!");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to update profile details");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="updateProfile">
      <h3>Update your profile</h3>

      <form onSubmit={handleSubmit}>
        <label>Upload Profile Picture:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Update Profile"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

      </form>

      <form onSubmit={handleDetailsSubmit}>
        <label>Full Name:</label>
        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter full name" />

        <label>Phone Number:</label>
        <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Enter phone number" />

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Details"}
        </button>
      </form>
      
    </div>
  );
};

export default UpdateProfile;
