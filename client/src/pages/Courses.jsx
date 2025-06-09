import React, { useState, useEffect } from 'react';
import supabase from '../utils/supabaseClient';
import { Link } from 'react-router-dom';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(30);
  const [filters, setFilters] = useState({
    general_field: '',
    level: '',
    language: '',
    minFee: '',
    maxFee: ''
  });
  const [sortBy, setSortBy] = useState('name_asc');
  
  const fields = [
    "Social Sciences",
    "Arts, Media & Humanities",
    "Business, Economics & Management",
    "Environmental & Agricultural Sciences",
    "Natural & Physical Sciences",
    "Engineering & Technology",
    "Law & Legal Studies",
    "Health & Life Sciences",
    "Computer & Information Sciences",
    "Research Training"
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error, count } = await supabase
          .from('courses')
          .select('id, name, general_field, duration, university_id, universities(name)', { count: 'exact' })
          .ilike('general_field', `%${filters.general_field}%`)
          .ilike('level', `%${filters.level}%`)
          .ilike('language', `%${filters.language}%`)
          .gte('tuition_fee', filters.minFee || 0)
          .lte('tuition_fee', filters.maxFee || 100000)
          .order(sortBy === 'name_asc' ? 'name' : 'tuition_fee', { ascending: sortBy === 'tuition_fee_asc' })
          .range((currentPage - 1) * coursesPerPage, currentPage * coursesPerPage - 1);

        if (!error) {
          setCourses(data);
          setTotalCourses(count);
        } else {
          console.error('Error fetching courses:', error);
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };

    fetchCourses();
  }, [currentPage, filters, sortBy]);

  const totalPages = Math.ceil(totalCourses / coursesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="min-h-screen bg-blue-700 text-white px-6 py-10 animate-fade-in-up">
      <h1 className="text-4xl font-bold text-center text-white mb-10">Courses List</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-5xl mx-auto">
        <select
          className="p-2 rounded-md bg-white text-blue-700"
          name="general_field"
          value={filters.general_field}
          onChange={handleFilterChange}
        >
          <option value="">Select Field</option>
          {fields.map((field, index) => (
            <option key={index} value={field}>{field}</option>
          ))}
        </select>

        <select
          className="p-2 rounded-md bg-white text-blue-900"
          name="level"
          value={filters.level}
          onChange={handleFilterChange}
        >
          <option value="">All Levels</option>
          <option value="UG">UG</option>
          <option value="PG">PG</option>
          <option value="PhD">PhD</option>
        </select>

        <input
          className="p-2 rounded-md bg-white text-blue-900"
          type="text"
          name="language"
          value={filters.language}
          onChange={handleFilterChange}
          placeholder="Search by language"
        />

        <input
          className="p-2 rounded-md bg-white text-blue-900"
          type="number"
          name="minFee"
          value={filters.minFee}
          onChange={handleFilterChange}
          placeholder="Min Fee"
        />
        <input
          className="p-2 rounded-md bg-white text-blue-900"
          type="number"
          name="maxFee"
          value={filters.maxFee}
          onChange={handleFilterChange}
          placeholder="Max Fee"
        />

        <select
          className="p-2 rounded-md bg-white text-blue-900"
          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="name_asc">Name (A-Z)</option>
          <option value="tuition_fee_asc">Tuition Fee (Low to High)</option>
          <option value="tuition_fee_desc">Tuition Fee (High to Low)</option>
        </select>
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <p className="text-center text-lg">No courses available.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {courses.map(course => (
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

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-10 space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-400' : 'bg-yellow-400 hover:bg-yellow-500'} text-blue-900 font-semibold`}
        >
          Previous
        </button>
        <span className="text-white font-medium">Page {currentPage} of {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-400' : 'bg-yellow-400 hover:bg-yellow-500'} text-blue-900 font-semibold`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Courses;
