import AllFundings from "@/components/dashboard/AllFundings";
import FundForm from "@/components/dashboard/funding/fund-form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuth from "@/hooks/useAuth";
import { axiosBase } from "@/services/BaseService";
import { useQuery } from "@tanstack/react-query";
import { CirclePlus } from "lucide-react";
import { useState } from "react";

export const defaultFund = {
  name: "",
  description: "",
  amount: 0,
  isSeeking: true,
  isOffering: false,
  occupation: "",
  subOccupation: "",
};

export default function Fundnig() {
  const [isGetFunding, setIsGetFunding] = useState(true);
  const [selectedFund, setSelectedFund] = useState(defaultFund);

  const { auth } = useAuth();
  const { data: fundings, isPending } = useQuery({
    queryKey: ["fundings"],
    queryFn: () =>
      axiosBase.get("/fundings", {
        headers: { Authorization: auth.access_token },
      }),
    select: (data) => data.data?.fundings,
  });

  return (
    <main className="p-4 max-w-7xl mx-auto w-full">
      <Tabs
        defaultValue="get"
        onValueChange={() => setIsGetFunding(!isGetFunding)}
      >
        <TabsList className="grid w-full grid-cols-2 max-w-96 mx-auto mb-6 bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-gray-200">
          <TabsTrigger value="get">Get Funding</TabsTrigger>
          <TabsTrigger value="offer">Offer Funding</TabsTrigger>
        </TabsList>
        <TabsContent value="get" className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-end gap-4 w-full">
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
          <AllFundings
            fundings={fundings?.filter((f) => f.isSeeking)}
            isPending={isPending}
            isGetFunding={isGetFunding}
          />
        </TabsContent>
        <TabsContent value="offer" className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-end gap-4 w-full">
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
          <AllFundings
            fundings={fundings?.filter((f) => f.isOffering)}
            isPending={isPending}
            isGetFunding={isGetFunding}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}
