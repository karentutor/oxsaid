import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth"; // Import useAuth hook
import { axiosBase } from "@/services/BaseService";

const OwnProfile = ({ user }) => (
  <main className="pt-4 grid gap-6 index-grid">
    <div>Welcome, {user.firstName} {user.lastName}</div>
    {/* Add more components to display user's own profile data */}
  </main>
);

const OtherProfile = ({ userId }) => {
  const { auth } = useAuth(); // Use useAuth hook
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch the data for the other user's profile
    const fetchData = async () => {
      try {
        const response = await axiosBase.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${auth.access_token}` },
        });
        console.log("Raw response:", response.data.user);
        setUserData(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [userId, auth.access_token]);

  return (
    <main className="pt-4 grid gap-6 index-grid">
      <div>
        {userData ? (
          <div>
            <h1>{userData.firstName} {userData.lastName}'s Profile</h1>
            {/* Display other user's data */}
            <p>{userData.bio}</p>
            {/* Additional profile details */}
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </main>
  );
};

export default function Home() {
  const { id } = useParams();
  const { auth } = useAuth(); // Use useAuth hook

  if (!auth.user) {
    return <div>Loading...</div>; // Handle the case where the auth context is not yet populated
  }

  const isOwnProfile = !id || auth.user._id === id;

  return isOwnProfile ? (
    <OwnProfile user={auth.user} />
  ) : (
    <OtherProfile userId={id} />
  );
}
