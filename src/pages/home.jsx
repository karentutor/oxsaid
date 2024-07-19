import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { axiosBase } from "@/services/BaseService";
import { Main } from "@/components/dashboard/Main";
import { Sidebar } from "@/components/dashboard/Sidebar";

const OwnProfile = ({ user, auth }) => (
  <main className="pt-4 grid gap-6 index-grid">
    <Sidebar user={user} auth={auth} />
    <Main user={user} auth={auth} />
  </main>
);

const OtherProfile = ({ userId, auth }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch the data for the other user's profile
    const fetchData = async () => {
      try {
        const response = await axiosBase.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${auth.access_token}` },
        });
        console.log("Raw response:", response.data);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [userId, auth.access_token]);

  return (
    <main className="pt-4 grid gap-6 index-grid">

      <Sidebar user={userData} auth={auth} />
      <Main user={userData} auth={auth} />
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
    <OwnProfile user={auth.user} auth={auth} />
  ) : (
    <OtherProfile userId={id} auth={auth} />
  );
}
