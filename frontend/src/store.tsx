import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./context/ProtectedRoutes";
import Dashboard from "./pages/Dashboard";
import LoginForm from "./pages/Login";


function App() {
  return (
    // <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
      </Routes>
    // </Router>
  );
}