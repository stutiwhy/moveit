import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { signInUser } = UserAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { success, error } = await signInUser(email, password);

    if (!success) {
      setError(error);
      setLoading(false);
      setTimeout(() => setError(""), 3000);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 to-blue-500 font-sans px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-md animate-fade-in-down"
      >
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-4">Login to MoveIt</h2>
        <p className="text-center text-gray-600 mb-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-yellow-500 font-semibold hover:underline">
            Sign up
          </Link>
        </p>

        <div className="mb-5">
          <label htmlFor="email" className="block text-gray-700 font-medium">
            Email
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none transition"
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="block text-gray-700 font-medium">
            Password
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none transition"
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-blue-800 font-semibold py-3 rounded-md transition duration-300 transform hover:scale-105"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="text-red-600 text-center pt-4">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
