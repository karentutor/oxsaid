import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosHelper, { API_METHOD } from 'utils/axiosHelper';
import { COLLEGE_DATA, MATRICULATION_YEAR_DATA, OCCUPATION_DATA } from 'utils/data';
import { getDisplayNames } from 'utils/helperFunction';

const UserSearch = ({ onSearchChange }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [college, setCollege] = useState('');
  const [matriculationYear, setMatriculationYear] = useState('');
  const [industry, setIndustry] = useState('');
  const navigate = useNavigate();

  const handleSearch = (value) => {
    onSearchChange(value);
    // Optionally, perform search or filter based on `value`
  };

  useEffect(() => {
    const searchByKeyword = async () => {
      setLoading(true);
      const query = `college=${college}&matriculationYear=${matriculationYear}&occupation=${industry}&search=${search || 'all'}`;

      try {
        const response = await axiosHelper(API_METHOD.GET, `users/query/${query}`);
        if (response) {
          // Example: Filter and update options based on search results
          const filteredData = response.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
          setOptions(filteredData);
        }
      } catch (error) {
        console.error('Search error:', error);
      }
      setLoading(false);
    };

    searchByKeyword();
  }, [search, college, matriculationYear, industry]);

  const resetFilters = () => {
    setCollege('');
    setMatriculationYear('');
    setIndustry('');
    setOptions([]);
  };

  return (
    <div className="container mx-auto px-6 py-4">
      <div className="flex flex-wrap gap-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
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
        {options.map((option, index) => (
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
        ))}
      </div>
    </div>
  );
};

export default UserSearch;
