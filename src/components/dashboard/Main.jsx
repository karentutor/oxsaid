import useAuth from "@/hooks/useAuth";
import { FeedItem } from "./FeedItem";
import { NewPostCard } from "./NewPostCard";
import { useQuery } from "@tanstack/react-query";
import { axiosBase } from "@/services/BaseService";
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment";

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
    <div style={{ gridArea: "main" }}>
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
        posts.map((item) => (
          <FeedItem
            key={item._id}
            type="post"
            id={item._id}
            likes={item.likes}
            thumbnail={item?.picturePath}
            content={item?.description}
            author={{
              name: `${item.firstName} ${item.lastName}`,
              subtext: moment(item.createdAt).startOf().fromNow(),
              imageUrl: item.userPicturePath,
              connectionDegree: item.location,
            }}
            stats={{
              likes: Object.keys(item.likes)?.length,
              comments: item.comments.length,
              reposts: 593,
            }}
          />
        ))
      )}
    </div>
  );
};
