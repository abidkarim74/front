import { useState, FormEvent } from "react";
import { loginUser } from "../services/authServices";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    const accessToken = await loginUser(username, password, setLoading, setError);

    if (accessToken) {
      //navigate("/");
      window.location.assign("/");
    } 
  };

  return (
    <div className="login-container">
      <h2>Login to Your Account</h2>
      <form onSubmit={handleSubmit} className="login-form">
        {error && <p className="error-message">{error}</p>}

        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          placeholder="Your campus ID..."
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError(null);
          }}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Your password..."
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(null);
          }}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>
        Don't have a Carawan account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default LoginForm;
