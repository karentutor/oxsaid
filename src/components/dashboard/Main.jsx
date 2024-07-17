import useAuth from "@/hooks/useAuth";
import { FeedItem } from "./FeedItem";
import { NewPostCard } from "./NewPostCard";
import { useQuery } from "@tanstack/react-query";
import { axiosBase } from "@/services/BaseService";
import { Skeleton } from "@/components/ui/skeleton";

export const Main = () => {
  const { auth } = useAuth();
  const { data: posts, isPending } = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      axiosBase.get("/posts", {
        headers: { Authorization: auth.access_token },
      }),
    select: (data) => data.data,
  });
  return (
    <div className="[grid-area:main] mb-20">
      <NewPostCard />
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
      ) : (
         posts.map((item) => <FeedItem key={item._id} {...item} />)

)}
    </div>
  );
};
