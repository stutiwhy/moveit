import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import supabase from '../utils/supabaseClient';

const Universities = () => {
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    const fetchUnis = async () => {
      const { data, error } = await supabase.from('universities').select('*');
      if (!error) setUniversities(data);
    };
    fetchUnis();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-500 p-6 font-sans animate-fade-in-down">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Explore Universities</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {universities.map((uni) => (
            <div
              key={uni.id}
              className="bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-2xl transition duration-300 transform hover:scale-105 animate-fade-in-up"
            >
              <img
                src={uni.logo_url}
                alt={`${uni.name} logo`}
                className="h-20 w-auto object-contain mb-4"
              />
              <h2 className="text-xl font-semibold text-blue-800">{uni.name}</h2>
              <p className="text-sm text-gray-600 mb-2">{uni.city}</p>
              <Link
                to={`/universities/${uni.id}`}
                className="text-yellow-500 font-medium hover:underline mt-2"
              >
                More details →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Universities;