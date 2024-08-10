import EventCard from "@/components/dashboard/EventCard";
import EventForm from "@/components/dashboard/events/event-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuth from "@/hooks/useAuth";
import { axiosBase } from "@/services/BaseService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CirclePlus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const defaultEvent = {
  title: "",
  date: null,
  maxRegistrants: 1,
  eventFormat: "",
  eventLocation: "",
  zoomMeetingInvite: "",
  eventCoverImage: "",
  groupId: "",
  description: "",
};

export default function Events() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isMyEvents, setIsMyEvents] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(defaultEvent);
  const { auth } = useAuth();

  const queryClient = useQueryClient();

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

  // Delete Event
  const { mutate: deleteEvent } = useMutation({
    mutationFn: (eventId) =>
      axiosBase.delete(`/events/${eventId}`, {
        headers: { Authorization: auth.access_token },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event Deleted successfully");
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
      <Tabs defaultValue="all" onValueChange={() => setIsMyEvents(!isMyEvents)}>
        <TabsList className="grid w-full grid-cols-2 max-w-96 mx-auto mb-6 bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-gray-200">
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="mine">My Events</TabsTrigger>
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
          <EventForm
            type="add"
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
            trigger={
              <Button className="flex items-center gap-2">
                <CirclePlus size={14} /> Create Event
              </Button>
            }
          />
        </div>
        <TabsContent value="all">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-4 pt-0">
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
                            <Skeleton className="h-4" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                : events.map((item) => (
                    <EventCard key={item._id} item={item} />
                  ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="mine">
          <ScrollArea className="h-[calc(100vh-200px)]">
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
              ) : events.filter((j) => j.userId._id === auth.user._id).length >
                0 ? (
                events
                  .filter((j) => j.userId._id === auth.user._id)
                  .map((item) => (
                    <EventCard
                      key={item._id}
                      item={item}
                      isMyEvent
                      onDelete={() => deleteEvent(item._id)}
                    />
                  ))
              ) : (
                <div className="flex flex-col items-center justify-center md:col-span-2 lg:col-span-3 text-center gap-4 py-16">
                  <h3 className="text-3xl lg:text-4xl font-semibold">
                    No Events Found
                  </h3>
                  <p className="text-black/70">
                    Add your first event from the form at your left
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </main>
  );
}
