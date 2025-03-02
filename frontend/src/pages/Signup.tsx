import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../services/authServices";

const Signup = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [fullname, setFullname] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [gender, setGender] = useState<string>("male");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate(); // React Router v6 navigation

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Trim values to remove accidental spaces
    const trimmedUsername = username.trim();
    const trimmedFullname = fullname.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUsername || !trimmedFullname || !trimmedEmail) {
      setError("All fields are required!");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const res = await signupUser(
        { username: trimmedUsername, fullname: trimmedFullname, email: trimmedEmail, gender, password },
        setLoading,
        setError
      );

      if (res) {
        window.location.assign("/");

         // Redirect without reloading the page
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Create Your Carawan Account</h2>
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleSubmit} className="signup-form">
        <label>Username</label>
        <input
          type="text"
          placeholder="Enter your username..."
          value={username}
          onChange={(e) => { setUsername(e.target.value); setError(null); }}
          required
        />

        <label>Full name</label>
        <input
          type="text"
          placeholder="Enter your fullname..."
          value={fullname}
          onChange={(e) => { setFullname(e.target.value); setError(null); }}
          required
        />

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email..."
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(null); }}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Create a strong password..."
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(null); }}
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm your password..."
          value={confirmPassword}
          onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
          required
        />

        <label>Gender</label>
        <div className="gender-options">
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={gender === "male"}
              onChange={(e) => setGender(e.target.value)}
            />
            Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={gender === "female"}
              onChange={(e) => setGender(e.target.value)}
            />
            Female
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Signup;
