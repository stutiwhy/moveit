import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import supabase from '../utils/supabaseClient';

const UniversityDetails = () => {
  const { id } = useParams();
  const [university, setUniversity] = useState(null);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filters, setFilters] = useState({
    level: '',
    field: '',
    language: '',
  });

  useEffect(() => {
    const fetchUniversity = async () => {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .eq('id', id)
        .single();

      if (!error) setUniversity(data);
    };

    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('university_id', id);

      if (!error) {
        setCourses(data);
        setFilteredCourses(data);
      }
    };

    fetchUniversity();
    fetchCourses();
  }, [id]);

  useEffect(() => {
    let filtered = courses;

    if (filters.level) {
      filtered = filtered.filter((course) => course.level === filters.level);
    }
    if (filters.field) {
      filtered = filtered.filter((course) => course.general_field === filters.field); // Update to general_field
    }
    if (filters.language) {
      filtered = filtered.filter((course) => course.language === filters.language);
    }

    setFilteredCourses(filtered);
  }, [filters, courses]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  if (!university) return <p className="text-white p-6 animate-fade-in-down">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-blue-600 text-white p-6 animate-fade-in-down">
      {/* University Info */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-10 max-w-5xl mx-auto bg-white text-blue-900 rounded-2xl shadow-xl p-6 animate-fade-in-up">
        {university.logo_url && (
          <img
            src={university.logo_url}
            alt="Logo"
            className="w-32 h-32 object-contain rounded"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold mb-2">{university.name}</h1>
          <p><strong>City:</strong> {university.city}</p>
          <p><strong>Type:</strong> {university.public_or_private}</p>
          <p><strong>Website:</strong>{' '}
            <a href={university.website} target="_blank" rel="noreferrer" className="text-yellow-500 hover:underline">
              {university.website}
            </a>
          </p>
          <p><strong>Global Ranking:</strong> {university.ranking_global || 'N/A'}</p>
          <p><strong>National Ranking:</strong> {university.ranking_national || 'N/A'}</p>
        </div>
      </div>

      <p className="max-w-4xl mx-auto mb-8 text-center text-white animate-fade-in-up">
        {university.description}
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-8 animate-fade-in-up">
        <select
          name="level"
          value={filters.level}
          onChange={handleFilterChange}
          className="bg-white text-blue-900 px-4 py-2 rounded-md shadow focus:outline-none"
        >
          <option value="">All Levels</option>
          <option value="UG">UG</option>
          <option value="PG">PG</option>
          <option value="PhD">PhD</option>
        </select>

        <select
          name="field"
          value={filters.field}
          onChange={handleFilterChange}
          className="bg-white text-blue-900 px-4 py-2 rounded-md shadow focus:outline-none"
        >
          <option value="">All Fields</option>
          {[...new Set(courses.map((course) => course.general_field))].map((field) => (  // Update field to general_field
            <option key={field} value={field}>{field}</option>
          ))}
        </select>

        <select
          name="language"
          value={filters.language}
          onChange={handleFilterChange}
          className="bg-white text-blue-900 px-4 py-2 rounded-md shadow focus:outline-none"
        >
          <option value="">All Languages</option>
          {[...new Set(courses.map((course) => course.language))].map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      {/* Courses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto animate-fade-in-up">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white text-blue-900 rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition-transform transform hover:scale-105"
            >
              <h3 className="text-lg font-semibold mb-2">{course.name}</h3>
              <p><strong>Field:</strong> {course.general_field}</p>  {/* Update to general_field */}
              <p><strong>Level:</strong> {course.level}</p>
              <p><strong>Duration:</strong> {course.duration}</p>
              <p><strong>Language:</strong> {course.language}</p>
              <p><strong>Tuition Fee:</strong> {course.tuition_fee} {course.fee_currency} ({course.fee_per})</p>
              {course.application_fee && (
                <p><strong>Application Fee:</strong> {course.application_fee}</p>
              )}
              <Link
                to={`/courses/${course.id}`}
                className="text-yellow-500 mt-3 hover:underline"
              >
                More Details →
              </Link>
            </div>
          ))
        ) : (
          <p className="text-white text-center col-span-full">No courses found for the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default UniversityDetails;
