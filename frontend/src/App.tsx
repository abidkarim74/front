import "./App.css";
import { useAuth } from "./context/authContext";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";

const App = () => {
  const { user } = useAuth(); 

  return <div className="container">{user ? <Dashboard /> : <Login />}</div>;
};

export default App;
