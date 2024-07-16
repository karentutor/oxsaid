import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosBase } from '@/services/BaseService';
import { COLLEGE_DATA, MATRICULATION_YEAR_DATA, OCCUPATION_DATA } from '@/data';
import { getDisplayNames } from '@/utils/helperFunctions';
import useAuth from '@/hooks/useAuth';

const UserSearch = () => {
  const [search, setSearch] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [college, setCollege] = useState('');
  const [matriculationYear, setMatriculationYear] = useState('');
  const [industry, setIndustry] = useState('');
  const [isNonMobileScreens, setIsNonMobileScreens] = useState(false);
  const navigate = useNavigate();
  const { auth } = useAuth();

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsNonMobileScreens(window.innerWidth >= 1000);
    };

    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);

    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  useEffect(() => {
    const searchByKeyword = async () => {
      setLoading(true);
      const query = [
        `college=${encodeURIComponent(college)}`,
        `matriculationYear=${encodeURIComponent(matriculationYear)}`,
        `occupation=${encodeURIComponent(industry)}`,
        `search=${encodeURIComponent(search || 'all')}`
      ].join('&');

      try {
        const response = await axiosBase.get(`users/query/${query}`, {
          headers: { Authorization: `Bearer ${auth.access_token}` },
        });
        if (response) {
          const filteredData = response.data.filter((item) => item._id !== auth.user._id);
          setOptions(filteredData);
        }
      } catch (error) {
        console.error('Search error:', error);
      }
      setLoading(false);
    };

    searchByKeyword();
  }, [search, auth.access_token, auth.user._id, college, matriculationYear, industry]);

  const resetFilters = () => {
    setSearch('');
    setCollege('');
    setMatriculationYear('');
    setIndustry('');
    setOptions([]);
  };

  return (
    <div className="pb-16 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="mt-8 mb-4 text-3xl font-bold">Search Users</div>
        <div className={`flex ${isNonMobileScreens ? 'gap-4' : 'flex-col'}`}>
          <div className={`${isNonMobileScreens ? 'w-2/5' : 'w-full'} mt-4`}>
            <div className="container mx-auto px-6 py-4">
              <div className="flex flex-wrap gap-4">
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 w-full md:w-1/3"
                />

                {/* Filters */}
                <div className="flex gap-4 md:w-2/3">
                  {/* College Filter */}
                  <select
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 flex-1"
                  >
                    <option value="">Select College</option>
                    {COLLEGE_DATA.map((option) => (
                      <option key={option.name} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>

                  {/* Matriculation Year Filter */}
                  <select
                    value={matriculationYear}
                    onChange={(e) => setMatriculationYear(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 flex-1"
                  >
                    <option value="">Select Matriculation Year</option>
                    {MATRICULATION_YEAR_DATA.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  {/* Industry Filter */}
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 flex-1"
                  >
                    <option value="">Select Industry</option>
                    {OCCUPATION_DATA.map((option) => (
                      <option key={option.name} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>

                  {/* Reset Filters Button */}
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-2 hover:bg-blue-600"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </button>
                </div>
              </div>

              {/* Search Results */}
              <div className="mt-4">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  options.map((option, index) => (
                    <div key={index} className="border border-gray-300 rounded-lg p-4 mt-2 flex items-center justify-between">
                      {/* Avatar */}
                      <div className="mr-4">
                        <img
                          src={option.picturePath}
                          alt={getDisplayNames(option.firstName, option.lastName)}
                          className="w-12 h-12 rounded-full"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="font-bold">{getDisplayNames(option.firstName, option.lastName)}</div>
                        <div className="text-gray-600">{option.email || 'N/A'}</div>
                        <div className="text-gray-600">{option.college || 'N/A'}</div>
                        <div className="text-gray-600">{option.matriculationYear || 'N/A'}</div>
                        <div className="text-gray-600">{option.occupation || 'N/A'}</div>
                      </div>

                      {/* View Profile Button */}
                      <button
                        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                        onClick={() => navigate(`/profile/${option._id}`)}
                      >
                        View Profile
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSearch;
