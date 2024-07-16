import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosBase } from '@/services/BaseService';
import { COLLEGE_DATA, MATRICULATION_YEAR_DATA, OCCUPATION_DATA } from '@/data';
import { getDisplayNames } from '@/utils/helperFunctions';
import useAuth from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";

const UserSearch = () => {
  const [search, setSearch] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [college, setCollege] = useState('');
  const [matriculationYear, setMatriculationYear] = useState('');
  const [industry, setIndustry] = useState('');
  const navigate = useNavigate();
  const { auth } = useAuth();

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
    <div className="pb-16 min-h-screen flex flex-col items-center">
      <div className="container mx-auto px-6">
        <div className="mt-8 mb-4 text-3xl font-bold text-center">Search Users</div>
        <div className="w-full flex flex-col items-center">
          <div className="w-full md:w-2/3 mt-4">
            <div className="px-6 py-4">
              {/* Search Input and Reset Filters */}
              <div className="flex justify-between mb-4 w-full">
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 w-full md:w-1/3"
                />
                <Button
                  variant="default"
                  size="default"
                  onClick={resetFilters}
                >
                  Reset Filters
                </Button>
              </div>
              {/* Filters */}
              <div className="flex flex-wrap gap-4 justify-center md:justify-between items-center mb-4">
                {/* College Filter */}
                <select
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 w-full md:w-auto"
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
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 w-full md:w-auto"
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
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 w-full md:w-auto"
                >
                  <option value="">Select Industry</option>
                  {OCCUPATION_DATA.map((option) => (
                    <option key={option.name} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Results */}
              <div className="mt-4">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  options.map((option, index) => (
                    <div key={index} className="border border-gray-300 rounded-lg p-4 mt-2 flex items-center justify-between w-full">
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
                      <Button
                        variant="destructive"
                        size="default"
                         className="text-white"
                        onClick={() => navigate(`/profile/${option._id}`)}
                      >
                        View Profile
                      </Button>
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