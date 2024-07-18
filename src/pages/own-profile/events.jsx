import EventCard from "@/components/dashboard/EventCard";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import useAuth from "@/hooks/useAuth";
import { axiosBase } from "@/services/BaseService";
import { useQuery } from "@tanstack/react-query";

export default function ProfileEvents() {
  const { auth } = useAuth();
  const { data: events, isPending } = useQuery({
    queryKey: ["events"],
    queryFn: () =>
      axiosBase.get(`/events/get-public-events`, {
        headers: { Authorization: auth.access_token },
      }),
    select: (data) =>
      data.data?.events?.filter((j) => j.userId._id === auth.user._id),
  });
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Events</h3>
        <p className="text-sm text-muted">Manage your events.</p>
      </div>
      <Separator />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 pt-0">
        {isPending ? (
          <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-60" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[225px]  rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
              </div>
            </div>
          </div>
        ) : events?.length > 0 ? (
          events.map((item) => <EventCard key={item._id} item={item} />)
        ) : (
          <h3 className="text-center text-xl mt-10 col-span-2">
            No Events Found
          </h3>
        )}
      </div>
    </div>
  );
}
