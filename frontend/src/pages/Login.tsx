import { useState, FormEvent } from "react";
import { loginUser } from "../services/authServices";
import { Link } from "react-router-dom";
import "../../public/logo.jpg";
import "../../public/new.gif";

const LoginForm = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  console.log(error);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    const accessToken = await loginUser(
      username,
      password,
      setLoading,
      setError
    );

    if (accessToken) {
      window.location.assign("/");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-4 bg-cover bg-center"
      style={{ backgroundImage: "url('new.gif')" }}
    >
      <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <img
            src="logo.jpg"
            alt="Logo"
            className="w-12 h-12 object-contain rounded"
          />
        </div>
        <h2 className="text-blue-800 font-semibold text-xl mb-2">
          Welcome Back!
        </h2>
        <p className="text-gray-600 text-sm mb-4">Log in to continue</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username or Email"
            required
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-3xl focus:outline-none transition-all
            hover:border-transparent focus:border-transparent focus:ring-[3px] focus:ring-blue-500 
            focus:border-[1px] hover:border-[1px] hover:ring-[1px] hover:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-3xl focus:outline-none transition-all
            hover:border-transparent focus:border-transparent focus:ring-[3px] focus:ring-blue-500 
            focus:border-[1px] hover:border-[1px] hover:ring-[1px] hover:ring-blue-500"
          />

          <button
            type="submit"
           className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-3xl font-medium 
  transition-all duration-500 hover:from-blue-600 hover:to-blue-800"
          >
            {loading ? <div>Logging In...</div> : <div>Log In</div>}
          </button>
        </form>
        <div className="my-4 text-gray-500 font-medium">OR</div>
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-medium hover:text-blue-800 transition-all"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
