import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const OwnProfile = () => (
  <main className="pt-4 grid gap-6 index-grid">
    {/* Existing components */}
    <div>This is your profile</div>
  </main>
);

const OtherProfile = ({ userId }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch the data for the other user's profile
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <main className="pt-4 grid gap-6 index-grid">
      <div>
        {userData ? (
          <div>
            <h1>{userData.name}'s Profile</h1>
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

  return id ? <OtherProfile userId={id} /> : <OwnProfile />;
}
