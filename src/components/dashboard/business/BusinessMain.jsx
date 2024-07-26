import { useNavigate } from 'react-router-dom';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "react-router-dom";
import BusinessList from "./BusinessList";
import { axiosBase } from "@/services/BaseService";
import useAuth from "@/hooks/useAuth";

export default function BusinessMain() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allBusinesses, setAllBusinesses] = useState([]);
  const [myBusinesses, setMyBusinesses] = useState([]);
  const [combinedBusinesses, setCombinedBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'all';
  const navigate = useNavigate();


  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const [allRes, ownRes] = await Promise.all([
          axiosBase.get('/businesses', {
            headers: { Authorization: `Bearer ${auth.access_token}` },
          }),
          axiosBase.get('/businesses/own', {
            headers: { Authorization: `Bearer ${auth.access_token}` },
          }),
        ]);

        const allBusinessesData = Array.isArray(allRes.data) && allRes.data.length ? allRes.data : [];
        const myBusinessesData = Array.isArray(ownRes.data) && ownRes.data.length ? ownRes.data : [];

        console.log("Response from /businesses:", allBusinessesData);
        console.log("Response from /businesses/own:", myBusinessesData);

        setAllBusinesses(allBusinessesData);
        setMyBusinesses(myBusinessesData);

        // Combine and filter unique businesses
        const combined = [...allBusinessesData, ...myBusinessesData];
        const uniqueCombined = Array.from(new Map(combined.map(b => [b._id, b])).values());
        console.log("Unique Combined Businesses:", uniqueCombined);

        setCombinedBusinesses(uniqueCombined);
      } catch (err) {
        setError(err);
        console.error("Error fetching businesses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [auth.access_token]);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this business?')) {
      try {
        await axiosBase.delete(`/businesses/${id}`, {
          headers: { Authorization: `Bearer ${auth.access_token}` },
        });
        setAllBusinesses(allBusinesses.filter(b => b._id !== id));
        setMyBusinesses(myBusinesses.filter(b => b._id !== id));
        setCombinedBusinesses(combinedBusinesses.filter(b => b._id !== id));
      } catch (error) {
        console.error("Error deleting business:", error);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-business/${id}`);
  };

  return (
    <section className="[grid-area:main]">
      <Tabs defaultValue={initialTab}>
        <TabsList className="grid w-full grid-cols-2 max-w-96 mx-auto mb-6 bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-gray-200">
          <TabsTrigger value="all">All Businesses</TabsTrigger>
          <TabsTrigger value="mine">My Businesses</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl lg:text-3xl font-semibold text-center py-3">
              All Businesses
            </h1>
            <div className="bg-background/95 p-4 backdrop-blur w-full supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search"
                    className="pl-8"
                  />
                </div>
              </form>
            </div>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : combinedBusinesses.length === 0 ? (
            <div className="text-black">No Businesses Found. Please check back later.</div>
          ) : (
            <BusinessList
              businesses={combinedBusinesses}
              onDelete={handleDelete}
              onEdit={handleEdit}
              isLoading={loading}
              showEditDelete={false}
            />
          )}
        </TabsContent>
        <TabsContent value="mine">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl lg:text-3xl font-semibold text-center py-3">
              My Businesses
            </h1>
            {loading ? (
              <div>Loading...</div>
            ) : myBusinesses.length === 0 ? (
              <div className="text-black">No Businesses Found. Would you like to create one where you work or own?</div>
            ) : (
              <BusinessList
                businesses={myBusinesses}
                onDelete={handleDelete}
                onEdit={handleEdit}
                isLoading={loading}
                showEditDelete={true}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
