import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { signUpNewUser } = UserAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signUpNewUser(email, password, displayName);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error.message || "Registration failed.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 to-blue-500 font-sans px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-md animate-fade-in-down"
      >
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-4">Register to MoveIt</h2>
        <p className="text-center text-gray-600 mb-6">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-500 font-semibold hover:underline">
            Login
          </Link>
        </p>

        {/* Full Name */}
        <div className="mb-5">
          <label htmlFor="displayName" className="block text-gray-700 font-medium">
            Full Name
          </label>
          <input
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none transition"
            type="text"
            name="displayName"
            id="displayName"
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* Email */}
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

        {/* Password */}
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-blue-800 font-semibold py-3 rounded-md transition duration-300 transform hover:scale-105"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Error Message */}
        {error && <p className="text-red-600 text-center pt-4">{error}</p>}
      </form>
    </div>
  );
};

export default Register;
