import { useAuth } from "../context/authContext";
import { logoutUser } from "../services/authServices";

const Dashboard = () => {
  const { user, setUser, accessToken } = useAuth();
  
  console.log(user);

  return (
    <div>
      <h1>Welcome, {user?.username}</h1>
      <button onClick={() => logoutUser(setUser, accessToken)}>Logout</button>
    </div>
  );
};

export default Dashboard;
