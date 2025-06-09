import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

function Navbar() {
  const { session, logoutUser } = UserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { success, error } = await logoutUser();
    if (success) {
      navigate("/login");
    } else {
      console.error("Logout failed:", error);
    }
  };

  const handleHomeClick = () => {
    if (session) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="w-full bg-white shadow-md font-sans">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <span className="text-blue-600 font-extrabold text-2xl tracking-wide">MoveIt</span>
        </div>

        {/* Center Navigation Links */}
        <div className="flex space-x-6 text-lg font-medium">
          <button 
            onClick={handleHomeClick} 
            className="hover:bg-blue-600 hover:text-white px-3 py-2 rounded transition-all duration-200"
          >
            Home
          </button>
          <Link 
            to="/universities" 
            className="hover:bg-blue-600 hover:text-white px-3 py-2 rounded transition-all duration-200"
          >
            Universities
          </Link>
          <Link 
            to="/courses" 
            className="hover:bg-blue-600 hover:text-white px-3 py-2 rounded transition-all duration-200"
          >
            Courses
          </Link>
          <Link 
            to="/recommendations" 
            className="hover:bg-blue-600 hover:text-white px-3 py-2 rounded transition-all duration-200"
          >
            Recommendations
          </Link>
        </div>

        {/* Right side - Auth Options */}
        <div className="flex space-x-4 text-lg font-medium">
          {session ? (
            <>
              <Link
                to="/profile"
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
