/* eslint-disable react/prop-types */
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import moment from "moment";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function AllFundings({ fundings, isPending, isGetFunding }) {
  return (
    <section className="[grid-area:main]">
      <h1 className="text-2xl lg:text-3xl font-semibold text-center py-3">
        {isGetFunding ? "Fundings Opportunities" : "Funding Offers"}
      </h1>
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
          ) : fundings.length > 0 ? (
            fundings?.map((item) => (
              <button
                key={item._id}
                className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent/10"
              >
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">
                        amount: <span className="text-2xl">{item.amount}$</span>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "ml-auto text-xs text-accent hover:!text-primary flex items-center gap-2"
                      )}
                    >
                      {moment(item.createdAt).startOf().fromNow()}
                    </div>
                  </div>
                  <div className="text-xs font-semibold">
                    field:{" "}
                    <span className="font-medium">
                      {item.occupation} | {item.subOccupation}
                    </span>
                  </div>
                  <div className="text-xs font-semibold">
                    created by:{" "}
                    <span className="font-medium">
                      {item.userId.firstName} {item.userId.lastName}
                    </span>
                  </div>
                  <div className="text-xs font-semibold">
                    business:{" "}
                    <span className="font-medium">{item.name.name.name}</span>
                  </div>
                </div>
                <div className="text-xs font-semibold text-muted">
                  description:{" "}
                  <span className="font-medium">
                    {item.description.substring(0, 300)}
                  </span>
                </div>
              </button>
            ))
          ) : (
            <h3 className="text-center text-xl mt-10">No Fundings Found</h3>
          )}
        </div>
      </ScrollArea>
    </section>
  );
}
