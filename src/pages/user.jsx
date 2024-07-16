import { useEffect, useState } from 'react';
import UserSearch from './user-search';
import axiosHelper from 'utils/axiosHelper'; // Assuming axiosHelper is properly imported

const User = () => {
  const [isNonMobileScreens, setIsNonMobileScreens] = useState(false);
  const [user, setUser] = useState(null); // State to store user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

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
    const fetchUser = async () => {
      try {
        // Simulating an API call to fetch user data
        const response = await axiosHelper.get('/user'); // Replace with your actual API endpoint
        setUser(response.data); // Update user state with fetched data
        setLoading(false); // Set loading to false after successful fetch
      } catch (error) {
        setError(error.message); // Set error state if API call fails
        setLoading(false); // Set loading to false on error
      }
    };

    fetchUser(); // Call fetchUser when component mounts
  }, []);

  return (
    <div className="pb-16 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="mt-8 mb-4 text-3xl font-bold">Search Users</div>
        <div className={`flex ${isNonMobileScreens ? 'gap-4' : 'flex-col'}`}>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <div className={`${isNonMobileScreens ? 'w-2/5' : 'w-full'} mt-4`}>
              {/* Pass user data to UserSearch component */}
              <UserSearch user={user} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
