import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Card } from "../ui/card";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { axiosBase } from "@/services/BaseService";
import { Skeleton } from "../ui/skeleton";
import GroupCard from "./GroupCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default function AllGroups() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isMyGroups, setIsMyGroups] = useState(false);
  const { auth } = useAuth();

  const { data: myGroups, isPending: isMyGroupsPending } = useQuery({
    queryKey: ["myGroups"],
    queryFn: () =>
      axiosBase.get(`/groups/${auth.user?._id}`, {
        headers: { Authorization: auth.access_token },
      }),
    select: (data) =>
      data.data?.group.filter((item) =>
        item?.name.toLowerCase().includes(debouncedSearchTerm)
      ),
  });

  const { data: groups, isPending } = useQuery({
    queryKey: ["groups"],
    queryFn: () =>
      axiosBase.get("/groups", {
        headers: { Authorization: auth.access_token },
      }),
    select: (data) =>
      data.data?.group.filter((item) =>
        item?.name.toLowerCase().includes(debouncedSearchTerm)
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
      <Tabs defaultValue="all" onValueChange={() => setIsMyGroups(!isMyGroups)}>
        <TabsList className="grid w-full grid-cols-2 max-w-96 mx-auto mb-6 bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-gray-200">
          <TabsTrigger value="all">All Groups</TabsTrigger>
          <TabsTrigger value="mine">My Groups</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl lg:text-3xl font-semibold text-center py-3">
              All Groups
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 pt-0">
              {isPending ? (
                Array.from(Array(2).keys()).map((item) => (
                  <Card key={item}>
                    <div className="flex flex-col gap-6 p-6">
                      <div className="flex items-center justify-between space-x-4">
                        <Skeleton className="w-full h-52 rounded-lg" />
                      </div>
                      <div className="flex flex-col space-y-3">
                        <div className="space-y-2">
                          <Skeleton className="w-24 h-4" />
                          <Skeleton className="h-4" />
                          <Skeleton className="h-4" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : groups?.length > 0 ? (
                groups.map((item) => <GroupCard key={item._id} item={item} />)
              ) : (
                <h3 className="text-center text-xl mt-10 col-span-2">
                  No Groups Found
                </h3>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="mine">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl lg:text-3xl font-semibold text-center py-3">
              My Groups
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 pt-0">
              {isMyGroupsPending ? (
                Array.from(Array(2).keys()).map((item) => (
                  <Card key={item}>
                    <div className="flex flex-col gap-6 p-6">
                      <div className="flex items-center justify-between space-x-4">
                        <Skeleton className="w-full h-52 rounded-lg" />
                      </div>
                      <div className="flex flex-col space-y-3">
                        <div className="space-y-2">
                          <Skeleton className="w-24 h-4" />
                          <Skeleton className="h-4" />
                          <Skeleton className="h-4" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : myGroups?.length > 0 ? (
                myGroups.map((item) => <GroupCard key={item._id} item={item} />)
              ) : (
                <h3 className="text-center text-xl mt-10 col-span-2">
                  No Groups Found
                </h3>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </section>
  );
}
