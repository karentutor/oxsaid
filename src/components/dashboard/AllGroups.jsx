import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Card } from "../ui/card";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { axiosBase } from "@/services/BaseService";
import { Skeleton } from "../ui/skeleton";
import GroupCard from "./GroupCard";

export default function AllGroups() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const { auth } = useAuth();

  const { data: groups, isPending } = useQuery({
    queryKey: ["groups"],
    queryFn: () =>
      axiosBase.get("/groups", {
        headers: { Authorization: auth.access_token },
      }),
    select: (data) =>
      data.data?.group.filter((item) =>
        item?.name.toLowerCase().includes(debouncedSearchTerm)
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
    <section className="[grid-area:main]">
      <h1 className="text-2xl lg:text-3xl font-semibold text-center py-3">
        All Groups
      </h1>
      <div className="bg-background/95 p-4 backdrop-blur w-full supports-[backdrop-filter]:bg-background/60">
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
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 pt-0">
          {isPending ? (
            Array.from(Array(2).keys()).map((item) => (
              <Card key={item}>
                <div className="flex flex-col gap-6 p-6">
                  <div className="flex items-center justify-between space-x-4">
                    <Skeleton className="w-full h-52 rounded-lg" />
                  </div>
                  <div className="flex flex-col space-y-3">
                    <div className="space-y-2">
                      <Skeleton className="w-24 h-4" />
                      <Skeleton className="h-4" />
                      <Skeleton className="h-4" />
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : groups?.length > 0 ? (
            groups.map((item) => <GroupCard key={item._id} item={item} />)
          ) : (
            <h3 className="text-center text-xl mt-10 col-span-2">
              No Groups Found
            </h3>
          )}
        </div>
      </ScrollArea>
    </section>
  );
}
