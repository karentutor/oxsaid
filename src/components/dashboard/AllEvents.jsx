import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Card } from "../ui/card";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { axiosBase } from "@/services/BaseService";
import { Skeleton } from "../ui/skeleton";
import EventCard from "./EventCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default function AllEvents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isMyEvents, setIsMyEvents] = useState(false);
  const { auth } = useAuth();

  const { data: events, isPending } = useQuery({
    queryKey: ["events"],
    queryFn: () =>
      axiosBase.get("/events/get-public-events", {
        headers: { Authorization: auth.access_token },
      }),
    select: (data) =>
      data.data?.events.filter((item) =>
        item?.title.toLowerCase().includes(debouncedSearchTerm)
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
      <Tabs defaultValue="all" onValueChange={() => setIsMyEvents(!isMyEvents)}>
        <TabsList className="grid w-full grid-cols-2 max-w-96 mx-auto mb-6 bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-gray-200">
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="mine">My Events</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl lg:text-3xl font-semibold text-center py-3">
              All Events
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
              {isPending
                ? Array.from(Array(2).keys()).map((item) => (
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
                            <Skeleton className="h-14" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                : events?.map((item) => (
                    <EventCard key={item._id} item={item} />
                  ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="mine">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl lg:text-3xl font-semibold text-center py-3">
              My Events
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
                ))
              ) : events.filter((j) => j.userId._id === auth.user._id) > 0 ? (
                events
                  .filter((j) => j.userId._id === auth.user._id)
                  ?.map((item) => <EventCard key={item._id} item={item} />)
              ) : (
                <div className="flex flex-col items-center justify-center text-center gap-4 py-16 col-span-1 lg:col-span-2">
                  <h3 className="text-3xl lg:text-4xl font-semibold">
                    No Events Found
                  </h3>
                  <p className="text-black/70">
                    Create your first event from the form at your left
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
