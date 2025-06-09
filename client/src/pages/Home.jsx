import React from 'react';
import { Link } from 'react-router-dom';
import homeImage from '../assets/images/home-img.png';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen w-screen font-sans bg-gradient-to-br from-blue-700 to-blue-500 overflow-hidden">
      {/* Content Wrapper */}
      <div className="flex flex-row flex-1 items-center justify-between px-16 py-10">
        {/* Left Side */}
        <div className="w-1/2 space-y-6 animate-fade-in-down flex flex-col items-center text-center">
          <h1 className="text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
            Find Your Perfect<br />International Education
          </h1>
          <p className="text-lg text-blue-100 max-w-md">
            Discover universities and courses around the globe<br />
            that match your profile, your budget, and your aspirations.
          </p>

          <div className="flex gap-6 mt-6">
            <Link
              to="/register"
              className="px-6 py-3 rounded-full text-lg font-bold transition-all duration-300 shadow-md bg-yellow-400 hover:bg-yellow-300 text-blue-700 hover:scale-105"
            >
              Register Now
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-full text-lg font-bold transition-all duration-300 shadow-md bg-white hover:bg-gray-200 text-blue-600 hover:scale-105"
            >
              Login Now
            </Link>
          </div>

          {/* Tagline */}
          <h2 className="text-2xl text-white pt-6 font-medium">
            Start your journey today
          </h2>
        </div>

        {/* Right Side - Hero Image */}
        <div className="w-1/2 flex justify-center items-center animate-fade-in-up">
          <img
            src={homeImage}
            alt="International Education"
            className="w-[99%] max-w-lg rounded-xl shadow-2xl transition-transform hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;