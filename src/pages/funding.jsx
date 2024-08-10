import FundForm from "@/components/dashboard/funding/fund-form";
import FundingCard from "@/components/dashboard/FundingCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuth from "@/hooks/useAuth";
import { axiosBase } from "@/services/BaseService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CirclePlus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const defaultFund = {
  name: "",
  description: "",
  amount: 0,
  isSeeking: true,
  occupation: "",
  subOccupation: "",
};

export default function Fundnig() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isGetFunding, setIsGetFunding] = useState(true);
  const [selectedFund, setSelectedFund] = useState(defaultFund);
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  // Delete Job
  const { mutate: deleteFunding } = useMutation({
    mutationFn: (id) =>
      axiosBase.delete(
        `/fundings/${id}`,
        {},
        {
          headers: { Authorization: auth.access_token },
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fundings"] });
      toast.success("Fund Deleted successfully");
    },
    onError: () => toast.error("Something went wrong"),
  });

  const { data: fundings, isPending } = useQuery({
    queryKey: ["fundings"],
    queryFn: () =>
      axiosBase.get("/fundings", {
        headers: { Authorization: auth.access_token },
      }),
    select: (data) =>
      data.data?.fundings.filter((item) =>
        item?.businessId?.name.toLowerCase().includes(debouncedSearchTerm)
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
    <main className="p-4 max-w-7xl mx-auto w-full">
      <Tabs
        defaultValue="get"
        onValueChange={() => setIsGetFunding(!isGetFunding)}
      >
        <TabsList className="grid w-full grid-cols-3 max-w-96 mx-auto mb-6 bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-gray-200">
          <TabsTrigger value="get">Get Funding</TabsTrigger>
          <TabsTrigger value="offer">Offer Funding</TabsTrigger>
          <TabsTrigger value="mine">My Fundings</TabsTrigger>
        </TabsList>
        <TabsContent value="get" className="w-full flex flex-col gap-4">
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
            <FundForm
              type="add"
              isSeeking
              selectedFund={selectedFund}
              setSelectedFund={setSelectedFund}
              trigger={
                <Button className="flex items-center gap-2">
                  <CirclePlus size={14} /> Apply for Fund
                </Button>
              }
            />
          </div>
          <section className="flex flex-col gap-2">
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
            ) : fundings?.filter((f) => f.isSeeking).length > 0 ? (
              fundings
                ?.filter((f) => f.isSeeking)
                ?.map((item) => <FundingCard key={item._id} item={item} />)
            ) : (
              <h3 className="text-center text-xl mt-10">No Fundings Found</h3>
            )}
          </section>
        </TabsContent>
        <TabsContent value="offer" className="w-full flex flex-col gap-4">
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
            <FundForm
              type="add"
              selectedFund={selectedFund}
              setSelectedFund={setSelectedFund}
              trigger={
                <Button className="flex items-center gap-2">
                  <CirclePlus size={14} /> Offer a Fund
                </Button>
              }
            />
          </div>
          <section className="flex flex-col gap-2">
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
            ) : fundings?.filter((f) => !f.isSeeking).length > 0 ? (
              fundings
                ?.filter((f) => !f.isSeeking)
                ?.map((item) => <FundingCard key={item._id} item={item} />)
            ) : (
              <h3 className="text-center text-xl mt-10">No Fundings Found</h3>
            )}
          </section>
        </TabsContent>
        <TabsContent value="mine" className="w-full flex flex-col gap-4">
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
            <FundForm
              type="add"
              selectedFund={selectedFund}
              setSelectedFund={setSelectedFund}
              trigger={
                <Button className="flex items-center gap-2">
                  <CirclePlus size={14} /> Create a Fund
                </Button>
              }
            />
          </div>
          <section className="flex flex-col gap-2">
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
            ) : fundings?.filter((f) => f.userId._id === auth.user._id).length >
              0 ? (
              fundings
                ?.filter((f) => f.userId._id === auth.user._id)
                ?.map((item) => (
                  <FundingCard
                    key={item._id}
                    item={item}
                    isMyFunding
                    onDelete={() => deleteFunding(item._id)}
                  />
                ))
            ) : (
              <h3 className="text-center text-xl mt-10">No Fundings Found</h3>
            )}
          </section>
        </TabsContent>
      </Tabs>
    </main>
  );
}
