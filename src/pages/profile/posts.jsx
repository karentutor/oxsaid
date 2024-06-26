import { FeedItem } from "@/components/dashboard/FeedItem";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import useAuth from "@/hooks/useAuth";
import { axiosBase } from "@/services/BaseService";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function ProfilePosts() {
  const { id } = useParams();
  const { auth } = useAuth();
  const { data: posts, isPending } = useQuery({
    queryKey: ["myPosts", id],
    queryFn: () =>
      axiosBase.get(`/posts/${id}`, {
        headers: { Authorization: auth.access_token },
      }),
    enabled: !!id,
    select: (data) => data.data,
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Posts</h3>
        <p className="text-sm text-muted">
          This is how others will see your posts on the site.
        </p>
      </div>
      <Separator />
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
      ) : posts?.length > 0 ? (
        posts.map((item) => <FeedItem key={item._id} {...item} />)
      ) : (
        <h3 className="text-center text-xl mt-10">No Posts Found</h3>
      )}
    </div>
  );
}
