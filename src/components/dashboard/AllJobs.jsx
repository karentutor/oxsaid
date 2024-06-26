import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { axiosBase } from "@/services/BaseService";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import JobCard from "./JobCard";

export default function AllJobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const { auth } = useAuth();
  const { data: jobs, isPending } = useQuery({
    queryKey: ["jobs"],
    queryFn: () =>
      axiosBase.get("/jobs", {
        headers: { Authorization: auth.access_token },
      }),
    select: (data) =>
      data.data?.jobs.filter((item) =>
        item?.jobTitle.toLowerCase().includes(debouncedSearchTerm)
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
        All Jobs
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
            jobs.map((item) => <JobCard key={item._id} item={item} />)
          )}
        </div>
      </ScrollArea>
    </section>
  );
}
