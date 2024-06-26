/* eslint-disable react/prop-types */
import { ScrollArea } from "../ui/scroll-area";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import FundingCard from "./FundingCard";

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
            fundings?.map((item) => <FundingCard key={item._id} item={item} />)
          ) : (
            <h3 className="text-center text-xl mt-10">No Fundings Found</h3>
          )}
        </div>
      </ScrollArea>
    </section>
  );
}
