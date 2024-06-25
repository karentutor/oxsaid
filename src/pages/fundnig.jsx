import AllFundings from "@/components/dashboard/AllFundings";
import FundingForms from "@/components/dashboard/FundingForms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuth from "@/hooks/useAuth";
import { axiosBase } from "@/services/BaseService";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Fundnig() {
  const [isGetFunding, setIsGetFunding] = useState(true);

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
    <main className="pt-4">
      <Tabs
        defaultValue="get"
        onValueChange={() => setIsGetFunding(!isGetFunding)}
      >
        <TabsList className="grid w-full grid-cols-2 max-w-96 mx-auto mb-6 bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-gray-200">
          <TabsTrigger value="get">Get Funding</TabsTrigger>
          <TabsTrigger value="offer">Offer Funding</TabsTrigger>
        </TabsList>
        <TabsContent value="get" className="grid gap-6 two-column-grid">
          <FundingForms isGetFunding={isGetFunding} />
          <AllFundings
            fundings={fundings.filter((f) => f.isSeeking)}
            isPending={isPending}
            isGetFunding={isGetFunding}
          />
        </TabsContent>
        <TabsContent value="offer" className="grid gap-6 two-column-grid">
          <FundingForms isGetFunding={isGetFunding} />
          <AllFundings
            fundings={fundings.filter((f) => f.isOffering)}
            isPending={isPending}
            isGetFunding={isGetFunding}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}
