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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default function AllJobs({
  setSelectedJob,
  setFormStatus,
  selectedJob,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isMyJobs, setIsMyJobs] = useState(false);
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
      <Tabs defaultValue="all" onValueChange={() => setIsMyJobs(!isMyJobs)}>
        <TabsList className="grid w-full grid-cols-2 max-w-96 mx-auto mb-6 bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-gray-200">
          <TabsTrigger value="all">All Jobs</TabsTrigger>
          <TabsTrigger value="mine">My Jobs</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="flex flex-col items-center justify-center text-center">
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
        </TabsContent>
        <TabsContent value="mine">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl lg:text-3xl font-semibold text-center py-3">
              My Jobs
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
              ) : jobs.filter((j) => j.userId._id === auth.user._id).length >
                0 ? (
                jobs
                  .filter((j) => j.userId._id === auth.user._id)
                  .map((item) => (
                    <JobCard
                      key={item._id}
                      item={item}
                      myJob
                      setSelectedState={setSelectedJob}
                      setFormStatus={setFormStatus}
                      selectedJob={selectedJob}
                    />
                  ))
              ) : (
                <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
                  <h3 className="text-3xl lg:text-4xl font-semibold">
                    No Jobs Found
                  </h3>
                  <p className="text-black/70">
                    Add your first jobs from the form at your left
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </section>
  );
}
