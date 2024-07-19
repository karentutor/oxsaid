import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosBase } from "@/services/BaseService";
import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "react-router-dom";
import BusinessList from "./BusinessList";

export default function BusinessMain() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const { auth } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'all';

  const queryClient = useQueryClient();

  const { data: allBusinesses = [], isLoading: allBusinessesLoading, error: allBusinessesError } = useQuery({
    queryKey: ["allBusinesses"],
    queryFn: () =>
      axiosBase.get('/businesses', {
        headers: { Authorization: auth.access_token },
      }).then(res => res.data.business),
    select: (data) =>
      data.filter((item) =>
        item?.name?.name.toLowerCase().includes(debouncedSearchTerm)
      ),
  });

  const { data: myBusinesses = [], isLoading: myBusinessesisLoading, error: myBusinessesError } = useQuery({
    queryKey: ["myBusinesses"],
    queryFn: () =>
      axiosBase.get('/businesses/own', {
        headers: { Authorization: auth.access_token },
      }).then(res => res.data ? [res.data] : []),
    select: (data) => {
      console.log("My Businesses:", data); // Log the response data
      return data.filter((item) =>
        item?.name?.name.toLowerCase().includes(debouncedSearchTerm)
      );
    },
  });

  const deleteBusinessMutation = useMutation({
    mutationFn: (id) => 
      axiosBase.delete(`/businesses/${id}`, {
        headers: { Authorization: auth.access_token },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries("allBusinesses");
      queryClient.invalidateQueries("myBusinesses");
    }
  });

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this business?')) {
      deleteBusinessMutation.mutate(id);
    }
  };

  const handleEdit = (id) => {
    // Implement edit functionality here
  };

  useEffect(() => {
    const debounceId = setTimeout(
      () => setDebouncedSearchTerm(searchTerm),
      1000
    );

    return () => clearTimeout(debounceId);
  }, [searchTerm]);

  useEffect(() => {
    if (allBusinessesError) console.error("Error fetching all businesses:", allBusinessesError);
    if (myBusinessesError && myBusinessesError.response && myBusinessesError.response.status !== 404) {
      console.error("Error fetching my businesses:", myBusinessesError);
    }
  }, [allBusinessesError, myBusinessesError]);

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
          <BusinessList
            businesses={allBusinesses}
            onDelete={handleDelete}
            onEdit={handleEdit}
            isLoading={allBusinessesLoading}
          />
        </TabsContent>
        <TabsContent value="mine">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl lg:text-3xl font-semibold text-center py-3">
              My Businesses
            </h1>
            {myBusinessesError && myBusinessesError.response && myBusinessesError.response.status === 404 ? (
              <div className="text-black">No Businesses Found. Would you like to create one where you work or own?</div>
            ) : (
              <BusinessList
                businesses={myBusinesses}
                onDelete={handleDelete}
                onEdit={handleEdit}
                isLoading={myBusinessesisLoading}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
