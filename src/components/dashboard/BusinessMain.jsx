import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { useQuery } from "@tanstack/react-query";
import { axiosBase } from "@/services/BaseService";
import useAuth from "@/hooks/useAuth";
import { Skeleton } from "../ui/skeleton";
import { Card } from "../ui/card";
import moment from "moment";

export default function BusinessMain() {
  const { auth } = useAuth();
  const { data: businesses, isPending } = useQuery({
    queryKey: ["businesses"],
    queryFn: () =>
      axiosBase.get("/businesses", {
        headers: { Authorization: auth.access_token },
      }),
    select: (data) => data.data?.business,
  });

  console.log("businesses", businesses);
  return (
    <section className="[grid-area:main]">
      <h1 className="text-2xl lg:text-3xl font-semibold text-center py-3">
        Businesses
      </h1>
      <div className="bg-background/95 p-4 backdrop-blur w-full supports-[backdrop-filter]:bg-background/60">
        <form>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted" />
            <Input placeholder="Search" className="pl-8" />
          </div>
        </form>
      </div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="flex flex-col gap-2 p-4 pt-0">
          {isPending ? (
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
          ) : (
            businesses?.map((item) => (
              <Card
                key={item._id}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent/10"
                )}
              >
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold text-lg">
                        {item.name.name}
                      </div>
                      {item.isLessThanTwoYears && (
                        <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "ml-auto text-xs text-accent hover:!text-primary flex items-center gap-4"
                      )}
                    >
                      <Badge className="ml-auto">{item.visibility}</Badge>
                      {moment(item.createdAt).startOf().fromNow()}
                    </div>
                  </div>
                  <div className="text-sm font-semibold">
                    address: <span className="font-medium">{item.address}</span>
                  </div>
                  <div className="text-sm font-semibold">
                    field:{" "}
                    <span className="font-medium">
                      {item.occupation} | {item.subOccupation}
                    </span>
                  </div>
                  <div className="text-sm font-semibold">
                    created by:{" "}
                    <span className="font-medium">
                      {item.userId.firstName} {item.userId.lastName}
                    </span>
                  </div>
                </div>
                <div className="line-clamp-2 font-semibold text-sm">
                  description:{" "}
                  <span className="font-medium">
                    {item.description.substring(0, 300)}
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </section>
  );
}
