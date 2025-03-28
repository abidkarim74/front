import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { signupUser } from "../services/authServices";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("male");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    <div
      className="flex flex-col items-center justify-center min-h-screen w-full px-4 sm:px-6 mt-2 lg:px-8 bg-cover bg-center"
      style={{ backgroundImage: "url('new.gif')" }}
    >
      <div className="mt-20 bg-white p-6 sm:p-10 rounded-xl shadow-lg text-center max-w-md w-full">
        <div className="flex justify-center mb-4">
          <img src="logo.jpg" alt="Logo" className="w-12 h-12 rounded-md" />
        </div>

        <h2 className="text-2xl font-semibold mb-2">Create an Account</h2>
        <p className="text-gray-600 text-sm">Sign up to get started</p>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <form className="mt-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-3xl focus:border-blue-500 hover:border-blue-400 focus:outline-none"
          />

          <input
            type="text"
            placeholder="Full Name"
            required
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-3xl focus:border-blue-500 hover:border-blue-400 focus:outline-none mt-3"
          />

          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-3xl focus:border-blue-500 hover:border-blue-400 focus:outline-none mt-3"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-3xl focus:border-blue-500 hover:border-blue-400 focus:outline-none mt-3"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-3xl focus:border-blue-500 hover:border-blue-400 focus:outline-none mt-3"
          />

          <label className="block text-gray-700 text-sm font-medium mt-4">Gender</label>
          <div className="flex justify-around mt-2 text-sm font-medium text-gray-700">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === "male"}
                onChange={() => setGender("male")}
                className="accent-blue-500"
              />
              Male
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === "female"}
                onChange={() => setGender("female")}
                className="accent-blue-500"
              />
              Female
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-3xl font-medium hover:from-blue-700 hover:to-blue-900"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="my-4 text-gray-500 text-sm flex items-center">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="mx-2">OR</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <p className="text-sm text-gray-700">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
