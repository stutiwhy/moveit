import React, { useEffect, useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import supabase from '../utils/supabaseClient';

const Dashboard = () => {
  const { session, logoutUser } = UserAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <h2 className="text-xl text-gray-600">You must be logged in to view this page.</h2>
      </div>
    );
  }

  const { user } = session;

  // Check if user profile exists and if it's incomplete
  useEffect(() => {
    const checkProfile = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        // If no profile exists, redirect to setup profile page
        navigate("/setup-profile");
      } else {
        // Check if profile is incomplete
        if (
          !data.full_name ||
          !data.education ||
          !data.career_goals ||
          data.education.length === 0
        ) {
          // If profile is incomplete, redirect to setup profile page
          navigate("/setup-profile");
        } else {
          setProfile(data); // If profile exists and is complete, set it
          setLoading(false); // Stop loading
        }
      }
    };

    checkProfile();
  }, [user, navigate]);

  const handleLogout = async () => {
    const { success, error } = await logoutUser();
    if (success) {
      // Redirect to the login page after logout
      navigate("/login");
    } else {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="bg-white min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-blue-600">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Logout
          </button>
        </header>

        <section className="mt-6">
          <h2 className="text-2xl text-blue-600">Welcome, {user?.user_metadata?.display_name || 'User'}!</h2>
          <p className="text-gray-700 mt-4">You're logged in and ready to start your journey.</p>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
