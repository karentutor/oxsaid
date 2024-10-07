import BusinessForm from "@/components/dashboard/business/BusinessForm";
import BusinessCard from "@/components/dashboard/BusinessCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuth from "@/hooks/useAuth";
import { axiosBase } from "@/services/BaseService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CirclePlus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const defaultBusiness = {
  name: "",
  address: "",
  phone: "",
  email: "",
  description: "",
  size: 0,
  isAlumniOwned: true,
  visibility: "",
  yearFounded: null,
  occupation: "",
  subOccupation: "",
  websiteUrl: "",
  picturePath: "",
};

export default function Business() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isMyBusiness, setIsMyBusiness] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(defaultBusiness);
  const { auth } = useAuth();

  const queryClient = useQueryClient();

  const { data: businesses, isPending } = useQuery({
    queryKey: ["businesses"],
    queryFn: () =>
      axiosBase.get("/businesses", {
        headers: { Authorization: auth.access_token },
      }),
    select: (data) =>
      data.data?.businesses.filter((item) =>
        item?.name.toLowerCase().includes(debouncedSearchTerm)
      ),
  });

  // Delete Business
  const { mutate: deleteBusiness } = useMutation({
    mutationFn: (businessId) =>
      axiosBase.delete(`/businesses/${businessId}`, {
        headers: { Authorization: auth.access_token },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      toast.success("Business Deleted successfully");
    },
    onError: () => toast.error("Something went wrong"),
  });

  useEffect(() => {
    const debounceId = setTimeout(
      () => setDebouncedSearchTerm(searchTerm),
      1000
    );

    return () => clearTimeout(debounceId);
  }, [searchTerm]);

  return (
    <main className="p-4 max-w-7xl mx-auto w-full">
      <Tabs
        defaultValue="all"
        onValueChange={() => setIsMyBusiness(!isMyBusiness)}
      >
        <TabsList className="grid w-full grid-cols-2 max-w-96 mx-auto mb-6 bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-gray-200">
          <TabsTrigger value="all">All Businesses</TabsTrigger>
          <TabsTrigger value="mine">My Businesses</TabsTrigger>
        </TabsList>
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
          <BusinessForm
            type="add"
            selectedBusiness={selectedBusiness}
            setSelectedBusiness={setSelectedBusiness}
            trigger={
              <Button className="flex items-center gap-2">
                <CirclePlus size={14} /> Create Business
              </Button>
            }
          />
        </div>
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-4 pt-0">
            {isPending ? (
              Array.from(Array(2).keys()).map((item) => (
                <Card key={item}>
                  <div className="flex flex-col gap-6 p-6">
                    <div className="flex items-center justify-between space-x-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-60" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="w-16 h-6 rounded-lg" />
                    </div>
                    <div className="flex flex-col space-y-3">
                      <div className="space-y-2">
                        <Skeleton className="h-4" />
                        <Skeleton className="h-4" />
                        <Skeleton className="h-4" />
                        <Skeleton className="h-4" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : businesses?.length > 0 ? (
              businesses.map((item) => (
                <BusinessCard key={item._id} item={item} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center md:col-span-2 lg:col-span-3 text-center gap-4 py-16">
                <h3 className="text-3xl lg:text-4xl font-semibold">
                  No Businesses Found
                </h3>
                <p className="text-black/70">
                  {searchTerm
                    ? "Try adjusting your search terms."
                    : "There are no businesses to display at the moment."}
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="mine">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-4 pt-0">
            {isPending ? (
              Array.from(Array(2).keys()).map((item) => (
                <Card key={item}>
                  <div className="flex flex-col gap-6 p-6">
                    <div className="flex items-center justify-between space-x-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-60" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="w-16 h-6 rounded-lg" />
                    </div>
                    <div className="flex flex-col space-y-3">
                      <div className="space-y-2">
                        <Skeleton className="h-4" />
                        <Skeleton className="h-4" />
                        <Skeleton className="h-4" />
                        <Skeleton className="h-4" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : businesses?.filter((j) => j.userId === auth.user._id).length >
              0 ? (
              businesses
                ?.filter((j) => j.userId === auth.user._id)
                .map((item) => (
                  <BusinessCard
                    key={item._id}
                    item={item}
                    isMyBusiness
                    onDelete={() => deleteBusiness(item._id)}
                  />
                ))
            ) : (
              <div className="flex flex-col items-center justify-center md:col-span-2 lg:col-span-3 text-center gap-4 py-16">
                <h3 className="text-3xl lg:text-4xl font-semibold">
                  No Businesses Found
                </h3>
                <p className="text-black/70">
                  Add your first business from the form at your left
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
