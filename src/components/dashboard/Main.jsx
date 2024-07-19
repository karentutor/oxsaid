import useAuth from "@/hooks/useAuth";
import { FeedItem } from "./FeedItem";
import { NewPostCard } from "./NewPostCard";
import { useQuery } from "@tanstack/react-query";
import { axiosBase } from "@/services/BaseService";
import { Skeleton } from "@/components/ui/skeleton";

export const Main = () => {
  const { auth } = useAuth();

  const { data: followedPosts, isLoading: isLoadingFollowed, error: errorFollowed } = useQuery({
    queryKey: ["followedPosts"],
    queryFn: () =>
      axiosBase.get("/posts/followed", {
        headers: { Authorization: `Bearer ${auth.access_token}` },
      }),
    select: (data) => data.data,
  });

  const { data: ownPosts, isLoading: isLoadingOwn, error: errorOwn } = useQuery({
    queryKey: ["ownPosts"],
    queryFn: () =>
      axiosBase.get("/posts/own", {
        headers: { Authorization: `Bearer ${auth.access_token}` },
      }),
    select: (data) => data.data,
  });

  if (errorFollowed || errorOwn) {
    return (
      <div>
        Error fetching posts: {errorFollowed?.message || errorOwn?.message}
      </div>
    );
  }

  const isLoading = isLoadingFollowed || isLoadingOwn;

  // Combine posts and sort by date
  const posts = [
    ...(ownPosts || []),
    ...(followedPosts || [])
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="[grid-area:main] mb-20">
      <NewPostCard />
      {isLoading ? (
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-60" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[225px] rounded-xl" />
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

