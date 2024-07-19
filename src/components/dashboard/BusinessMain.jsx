import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { axiosBase } from "@/services/BaseService";
import useAuth from "@/hooks/useAuth";
import { Skeleton } from "../ui/skeleton";
import { Card } from "../ui/card";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useLocation } from "react-router-dom";
import { Button } from "../ui/button";

export default function BusinessMain() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const { auth } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'all';

  const { data: allBusinesses = [], isLoading: allBusinessesLoading } = useQuery({
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

  const { data: myBusinesses = [], isLoading: myBusinessesisLoading } = useQuery({
    queryKey: ["myBusinesses"],
    queryFn: () =>
      axiosBase.get('/businesses/own', {
        headers: { Authorization: auth.access_token },
      }).then(res => [res.data]),
    select: (data) =>
      data.filter((item) =>
        item?.name?.name.toLowerCase().includes(debouncedSearchTerm)
      ),
  });

  useEffect(() => {
    const debounceId = setTimeout(
      () => setDebouncedSearchTerm(searchTerm),
      1000
    );

    return () => clearTimeout(debounceId);
  }, [searchTerm]);

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
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="flex flex-col gap-2 p-4 pt-0">
              {allBusinessesLoading ? (
                <Card>
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
                        <Skeleton className="h-14" />
                      </div>
                    </div>
                  </div>
                </Card>
              ) : allBusinesses.length > 0 ? (
                allBusinesses.map((item) => (
                  <Card key={item._id} className="p-4 flex flex-col lg:flex-row items-start gap-4">
                    <img src={item.picturePath} alt="Business" className="w-24 h-24 object-cover" />
                    <div className="flex-1 flex flex-col lg:flex-row justify-between w-full">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold">{item.name.name}</h2>
                        <p className="text-sm"><strong className="text-accent">Address:</strong> {item.address}</p>
                        <p className="text-sm"><strong className="text-accent">Phone:</strong> {item.phone}</p>
                        <p className="text-sm"><strong className="text-accent">Email:</strong> {item.email}</p>
                        <p className="text-sm"><strong className="text-accent">Description:</strong> {item.description}</p>
                      </div>
                      <div className="flex-1 lg:mt-0 mt-2 lg:ml-2">
                        <p className="text-sm"><strong className="text-accent">Size:</strong> {item.size}</p>
                        <p className="text-sm"><strong className="text-accent">Alumni Owned:</strong> {item.isAlumniOwned ? "Yes" : "No"}</p>
                        <p className="text-sm"><strong className="text-accent">Less Than Two Years:</strong> {item.isLessThanTwoYears ? "Yes" : "No"}</p>
                        <p className="text-sm"><strong className="text-accent">Visibility:</strong> {item.visibility}</p>
                        <p className="text-sm"><strong className="text-accent">Year Founded:</strong> {item.yearFounded}</p>
                        <p className="text-sm"><strong className="text-accent">Occupation:</strong> {item.occupation}</p>
                        <p className="text-sm"><strong className="text-accent">Sub-Occupation:</strong> {item.subOccupation}</p>
                        <p className="text-sm"><strong className="text-accent">Website:</strong> <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer">{item.websiteUrl}</a></p>
                        <p className="text-sm"><strong className="text-accent">Created At:</strong> {new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex flex-row items-center gap-2 lg:ml-2 lg:self-start">
                        <Button variant="default" className="mb-2 lg:mb-0">Edit</Button>
                        <Button variant="destructive">Delete</Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
                  <h3 className="text-3xl lg:text-4xl font-semibold">
                    No Businesses Found
                  </h3>
                  <p className="text-black/70">
                    Add your first business from the form at your left
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="mine">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl lg:text-3xl font-semibold text-center py-3">
              My Businesses
            </h1>
          </div>
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="flex flex-col gap-2 p-4 pt-0">
              {myBusinessesisLoading ? (
                <Card>
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
                        <Skeleton className="h-14" />
                      </div>
                    </div>
                  </div>
                </Card>
              ) : myBusinesses.length > 0 ? (
                myBusinesses.map((item) => (
                  <Card key={item._id} className="p-4 flex flex-col lg:flex-row items-start gap-4">
                    <img src={item.picturePath} alt="Business" className="w-24 h-24 object-cover" />
                    <div className="flex-1 flex flex-col lg:flex-row justify-between w-full">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold">{item.name.name}</h2>
                        <p className="text-sm"><strong className="text-accent">Address:</strong> {item.address}</p>
                        <p className="text-sm"><strong className="text-accent">Phone:</strong> {item.phone}</p>
                        <p className="text-sm"><strong className="text-accent">Email:</strong> {item.email}</p>
                        <p className="text-sm"><strong className="text-accent">Description:</strong> {item.description}</p>
                      </div>
                      <div className="flex-1 lg:mt-0 mt-2 lg:ml-2">
                        <p className="text-sm"><strong className="text-accent">Size:</strong> {item.size}</p>
                        <p className="text-sm"><strong className="text-accent">Alumni Owned:</strong> {item.isAlumniOwned ? "Yes" : "No"}</p>
                        <p className="text-sm"><strong className="text-accent">Less Than Two Years:</strong> {item.isLessThanTwoYears ? "Yes" : "No"}</p>
                        <p className="text-sm"><strong className="text-accent">Visibility:</strong> {item.visibility}</p>
                        <p className="text-sm"><strong className="text-accent">Year Founded:</strong> {item.yearFounded}</p>
                        <p className="text-sm"><strong className="text-accent">Occupation:</strong> {item.occupation}</p>
                        <p className="text-sm"><strong className="text-accent">Sub-Occupation:</strong> {item.subOccupation}</p>
                        <p className="text-sm"><strong className="text-accent">Website:</strong> <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer">{item.websiteUrl}</a></p>
                        <p className="text-sm"><strong className="text-accent">Created At:</strong> {new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex flex-row items-center gap-2 lg:ml-2 lg:self-start">
                        <Button variant="default" className="mb-2 lg:mb-0">Edit</Button>
                        <Button variant="destructive">Delete</Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
                  <h3 className="text-3xl lg:text-4xl font-semibold">
                    No Businesses Found
                  </h3>
                  <p className="text-black/70">
                    Add your first business from the form at your left
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </section>
  );
}
