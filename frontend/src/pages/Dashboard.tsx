import { createRoutesFromChildren } from "react-router-dom";
import { logoutUser } from "../services/authServices";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";
const Dashboard = () => {
  const auth = useContext(AuthContext);

  if (!auth) return <div>Loading...</div>;

  const {user,accessToken, setUser } = auth;


  

  return (
    <div>
      <h1></h1>
      <h1>Welcome, <Link to={`/${user?.id}`}>{user?.fullname}</Link></h1>
      <button onClick={() => logoutUser(setUser, accessToken)}>Logout</button>
    </div>
  );
};

export default Dashboard;
