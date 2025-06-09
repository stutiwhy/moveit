import React, { useState, useEffect } from 'react';
import supabase from '../utils/supabaseClient';
import { Link } from 'react-router-dom';

const Recommendations = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user || !user.id) {
          console.error("User not logged in or error fetching user:", userError);
          return;
        }

        const { data, error: profileError } = await supabase
          .from('user_profiles')
          .select('field_of_study, study_level')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setUserProfile(data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchRecommendedCourses = async () => {
      if (!userProfile) return;
      setLoading(true);

      const levelMap = {
        'Undergraduate': 'UG',
        'Postgraduate': 'PG',
        'PhD': 'PhD'
      };

      const mappedLevel = levelMap[userProfile.study_level];

      try {
        const { data, error } = await supabase
          .from('courses')
          .select('id, name, general_field, duration, university_id, universities(name)')
          .ilike('general_field', `%${userProfile.field_of_study}%`)
          .eq('level', mappedLevel);

        if (error) throw error;
        setRecommendedCourses(data);
      } catch (err) {
        console.error('Error fetching recommended courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedCourses();
  }, [userProfile]);

  return (
    <div className="min-h-screen bg-blue-700 text-white px-6 py-10 animate-fade-in-up">
      <h1 className="text-4xl font-bold text-center mb-10">Recommended Courses</h1>

      {loading ? (
        <p className="text-center text-lg">Loading recommendations...</p>
      ) : recommendedCourses.length === 0 ? (
        <p className="text-center text-lg">No recommendations found based on your profile.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {recommendedCourses.map(course => (
            <div key={course.id} className="bg-white text-blue-900 rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition">
              <div>
                <h3 className="text-xl font-semibold text-yellow-500 mb-1">{course.name}</h3>
                {course.universities && (
                  <p className="text-blue-600 font-medium mb-2">{course.universities.name}</p>
                )}
                <p><strong>Field:</strong> {course.general_field}</p>
                <p><strong>Duration:</strong> {course.duration}</p>
              </div>
              <Link
                to={`/courses/${course.id}`}
                className="mt-4 inline-block text-blue-700 font-medium hover:text-yellow-500 transition"
              >
                More Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
