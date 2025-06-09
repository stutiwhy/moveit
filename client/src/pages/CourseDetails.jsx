import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import supabase from '../utils/supabaseClient';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseAndUniversity = async () => {
      try {
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();

        if (courseError) throw courseError;
        setCourse(courseData);

        if (courseData.university_id) {
          const { data: uniData, error: uniError } = await supabase
            .from('universities')
            .select('id, name')
            .eq('id', courseData.university_id)
            .single();

          if (uniError) throw uniError;
          setUniversity(uniData);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching course or university:', error);
        setError('Failed to fetch course details. Please try again later.');
        setLoading(false);
      }
    };

    fetchCourseAndUniversity();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-700 flex items-center justify-center text-white animate-fade-in-down">
        <h2 className="text-2xl font-semibold">Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-700 flex flex-col items-center justify-center text-white animate-fade-in-down">
        <h2 className="text-3xl font-bold mb-4">Error</h2>
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-600 flex items-center justify-center p-6 animate-fade-in-up">
      <div className="bg-white text-blue-700 rounded-2xl shadow-xl p-8 max-w-xl w-full text-center">
        <h2 className="text-3xl font-bold text-yellow-500 mb-6">{course.name}</h2>

        {university && (
          <div className="mb-4">
            <strong>University:</strong>{' '}
            <Link
              to={`/universities/${university.id}`}
              className="ml-1 text-blue-500 underline hover:text-blue-700"
            >
              {university.name}
            </Link>
          </div>
        )}

        <div className="mb-4">
          <strong>Field:</strong> <span className="ml-1">{course.general_field || course.field}</span>
        </div>

        <div className="mb-4">
          <strong>Level:</strong> <span className="ml-1">{course.level}</span>
        </div>

        <div className="mb-4">
          <strong>Duration:</strong> <span className="ml-1">{course.duration}</span>
        </div>

        <div className="mb-4">
          <strong>Language:</strong> <span className="ml-1">{course.language}</span>
        </div>

        <div className="mb-4">
          <strong>Tuition Fee:</strong>{' '}
          <span className="ml-1">
            {course.tuition_fee} {course.fee_currency} ({course.fee_per})
          </span>
        </div>

        {course.application_fee && (
          <div className="mb-4">
            <strong>Application Fee:</strong>{' '}
            <span className="ml-1">{course.application_fee} {course.fee_currency}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
