import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

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
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Create Your Carawan Account</h2>
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-3">
            <label className="block text-gray-600 text-sm font-medium">Username</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your username..."
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(null); }}
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-gray-600 text-sm font-medium">Full Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your full name..."
              value={fullname}
              onChange={(e) => { setFullname(e.target.value); setError(null); }}
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-gray-600 text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-gray-600 text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Create a strong password..."
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-gray-600 text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Confirm your password..."
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium">Gender</label>
            <div className="flex items-center gap-4 mt-1">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={(e) => setGender(e.target.value)}
                  className="mr-2"
                />
                Male
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={(e) => setGender(e.target.value)}
                  className="mr-2"
                />
                Female
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
