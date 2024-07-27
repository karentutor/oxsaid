
import { CirclePlus, CircleX, Edit, Search } from "lucide-react";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { axiosBase } from "@/services/BaseService";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import BusinessCard from "@/components/dashboard/BusinessCard";
import BusinessForm from "@/components/dashboard/businesses/business-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import { ConfirmDelete } from "@/components/dashboard/FeedItem";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const defaultBusiness = {
  _id: "",
  name: "", // Assuming name.name should be used
  address: "",
  phone: "",
  email: "",
  description: "",
  size: 0,
  isAlumniOwned: false,
  visibility: "",
  yearFounded: 0,
  occupation: "",
  subOccupation: "",
  createdAt: "",
  websiteUrl: "",
  picturePath: ""
};

export default function Business() {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isMyBusinesses, setIsMyBusinessess] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(defaultBusiness);
  
  const { auth } = useAuth();


  const [businesses, setBusinesses] = useState([]);
  const [isPending, setIsPending] = useState(true);
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axiosBase.get('/businesses', {
          headers: { Authorization: auth.access_token },
        });

        console.log(response.data.businesses);
        if (response.data && response.data.businesses) {
          setBusinesses(response.data.businesses);
        } else {
          setBusinesses([]);
        }
      } catch (error) {
        console.error('Error fetching businesses:', error);
        setBusinesses([]);
      } finally {
        setIsPending(false);
      }
    };

    fetchBusinesses();
  }, [auth.access_token]);

  useEffect(() => {
    if (businesses.length) {
      console.log('Businesses:', businesses);
    }
  }, [businesses]);

  // const { data: businesses, isPending } = useQuery({
  //   queryKey: ["businesses"],
  //   queryFn: () =>
  //     axiosBase.get("/businesses", {
  //       headers: { Authorization: auth.access_token },
  //     }),
  //   select: (data) =>
  //     data.data?.businesses.filter((item) =>
  //       item?.jobTitle.toLowerCase().includes(debouncedSearchTerm)
  //     ),
  // });

  // Delete Job
  // const queryClient = useQueryClient();

  // const { mutate: deleteJob } = useMutation({
  //   mutationFn: () =>
  //     axiosBase.put(
  //       `/jobs/${selectedBusiness?._id}/close`,
  //       {},
  //       {
  //         headers: { Authorization: auth.access_token },
  //       }
  //     ),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["myJobs"] });
  //     toast.success("Job Closed successfully");
  //     setOpenConfirm(false);
  //   },
  //   onError: () => toast.error("Something went wrong"),
  // });

  // useEffect(() => {
  //   const debounceId = setTimeout(
  //     () => setDebouncedSearchTerm(searchTerm),
  //     1000
  //   );

  //   return () => clearTimeout(debounceId);
  // }, [searchTerm]);

  return (
    <main className="p-4 max-w-7xl mx-auto w-full">
      <Tabs defaultValue="all" onValueChange={() => setIsMyBusinessess(!isMyBusinesses)}>
        <TabsList className="grid w-full grid-cols-2 max-w-96 mx-auto mb-6 bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-gray-200">
          <TabsTrigger value="all">All Businesses</TabsTrigger>
          <TabsTrigger value="mine">My Businesses</TabsTrigger>
        </TabsList>
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
          <BusinessForm
            type="add"
            selectedBusiness={selectedBusiness}
            setSelectedBusiness={setSelectedBusiness}
            trigger={
              <Button className="flex items-center gap-2">
                <CirclePlus size={14} /> Create Business
              </Button>
            }
          />
        </div>
        <TabsContent value="all">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 p-4 pt-0">
              {isPending ? (
                Array.from(Array(2).keys()).map((item) => (
                  <Card key={item}>
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
                          <Skeleton className="h-4" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : businesses.length > 0 ? (
                businesses.map((item) => <BusinessCard key={item._id} item={item} />)
              ) : (
                <p>No businesses found.</p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="mine">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 p-4 pt-0">
              {isPending ? (
                Array.from(Array(2).keys()).map((item) => (
                  <Card key={item}>
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
                          <Skeleton className="h-4" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : businesses.filter((b) => b.userId._id === auth.user._id).length > 0 ? (
                businesses
                  .filter((b) => b.userId._id === auth.user._id)
                  .map((item) => (
                    <Card
                      key={item._id}
                      className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent/10"
                    >
                      <div className="flex w-full flex-col gap-1">
                        <div className="flex items-center">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold text-xl">
                              {item.name}
                            </div>
                          </div>
                          <div
                            className={cn(
                              "ml-auto text-xs text-accent hover:!text-primary flex items-center gap-2"
                            )}
                          >
                            {item.isClosed ? (
                              <Badge
                                variant="destructive"
                                className="text-white font-light"
                              >
                                Closed
                              </Badge>
                            ) : (
                              <Badge variant="" className="font-light">
                                Open
                              </Badge>
                            )}
                            {moment(item.createdAt).startOf().fromNow()}
                          </div>
                        </div>
                        <div className="text-xs font-semibold">
                          Location:{" "}
                          <span className="font-medium">
                            {item.country} | {item.city}
                          </span>
                        </div>
                        <div className="text-xs font-semibold">
                          Field:{" "}
                          <span className="font-medium">
                            {item.occupation} | {item.subOccupation}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-muted font-semibold">
                        Description:{" "}
                        <span className="font-medium">
                          {item.description.substring(0, 300)}
                        </span>
                      </div>
                      <div className="text-xs text-muted font-semibold">
                        Salary:{" "}
                        <span className="font-medium">{item.salary}$</span>
                      </div>
                      {isMyBusinesses ? (
                        <div className="flex items-center">
                          <JobForm
                            type="edit"
                            selectedBusiness={selectedBusiness}
                            setSelectedBusiness={setSelectedBusiness}
                            trigger={
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                                type="button"
                                onClick={() => setSelectedBusiness(item)}
                              >
                                <Edit size={14} /> Edit
                              </Button>
                            }
                          />

                          {item.isClosed ? null : (
                            <ConfirmDelete
                              isClose
                              onDelete={deleteJob}
                              open={openConfirm}
                              setOpen={setOpenConfirm}
                              Icon={CircleX}
                              isClosed={item.isClosed}
                            />
                          )}
                        </div>
                      ) : null}
                    </Card>
                  ))
              ) : (
                <p>No businesses found.</p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </main>
  );
}

// import { CirclePlus, CircleX, Edit, Search } from "lucide-react";
// import { Input } from "../components/ui/input";
// import { ScrollArea } from "../components/ui/scroll-area";
// import { useEffect, useState } from "react";
// import useAuth from "@/hooks/useAuth";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { axiosBase } from "@/services/BaseService";
// import { Card } from "../components/ui/card";
// import { Skeleton } from "../components/ui/skeleton";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "../components/ui/tabs";
// import BusinessCard from "@/components/dashboard/BusinessCard";
// import JobForm from "@/components/dashboard/jobs/job-form";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import moment from "moment";
// import { ConfirmDelete } from "@/components/dashboard/FeedItem";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";

// export const defaultBusiness = {
//   _id: "",
//   name: "", // Assuming name.name should be used
//   address: "",
//   phone: "",
//   email: "",
//   description: "",
//   size: 0,
//   isAlumniOwned: false,
//   visibility: "",
//   yearFounded: 0,
//   occupation: "",
//   subOccupation: "",
//   createdAt: "",
//   websiteUrl: "",
//   picturePath: ""
// };

// export default function Business() {
//   const [openConfirm, setOpenConfirm] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
//   const [isMyBusinesses, setIsMyBusinessess] = useState(false);
//   const [selectedBusiness, setSelectedBusiness] = useState(defaultBusiness);
//   const { auth } = useAuth();

//   const queryClient = useQueryClient();


//     // // Get Businesses
//     // const { data: businesses, isPending } = useQuery({
//     //   queryKey: ["businesses"],
//     //   queryFn: () =>
//     //     axiosBase.get("/businesses", {
//     //       headers: { Authorization: auth.access_token },
//     //     }),
//     //   select: (data) =>
//     //     data.data?.businesses.filter((item) =>
//     //       item?.businessTitle.toLowerCase().includes(debouncedSearchTerm)
//     //     ),
//     // });

//     const [businesses, setBusinesses] = useState([]);
//     const [isPending, setIsPending] = useState(true);
  
//     useEffect(() => {
//       const fetchBusinesses = async () => {
//         try {
//           const response = await axiosBase.get('/businesses', {
//             headers: { Authorization: auth.access_token },
//           });
  
//           console.log(response)
//           setBusinesses(response.data.businesses);
//         } catch (error) {
//           console.error('Error fetching businesses:', error);
//         } finally {
//           setIsPending(false);
//         }
//       };
  
//       fetchBusinesses();
//     }, [auth.access_token]);
  
//     useEffect(() => {
//       if (businesses.length) {
//         console.log('Businesses:', businesses);
//       }
//     }, [businesses]);


//   // Delete Job
//   const { mutate: deleteJob } = useMutation({
//     mutationFn: () =>
//       axiosBase.put(
//         `/jobs/${selectedBusiness?._id}/close`,
//         {},
//         {
//           headers: { Authorization: auth.access_token },
//         }
//       ),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["myJobs"] });
//       toast.success("Job Closed successfully");
//       setOpenConfirm(false);
//     },
//     onError: () => toast.error("Something went wrong"),
//   });


//   useEffect(() => {
//     if (businesses) {
//       console.log('Businesses:', businesses);
//     }
//   }, [businesses]);

//   useEffect(() => {
//     const debounceId = setTimeout(
//       () => setDebouncedSearchTerm(searchTerm),
//       1000
//     );

//     return () => clearTimeout(debounceId);
//   }, [searchTerm]);
//   return (
//     <main className="p-4 max-w-7xl mx-auto w-full">
//       <Tabs defaultValue="all" onValueChange={() => setIsMyBusinessess(!isMyBusinesses)}>
//         <TabsList className="grid w-full grid-cols-2 max-w-96 mx-auto mb-6 bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-gray-200">
//           <TabsTrigger value="all">All Businesses</TabsTrigger>
//           <TabsTrigger value="mine">My Businesses</TabsTrigger>
//         </TabsList>
//         <div className="flex items-center justify-between gap-4 w-full">
//           <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//             <form>
//               <div className="relative">
//                 <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted" />
//                 <Input
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Search"
//                   className="pl-8"
//                 />
//               </div>
//             </form>
//           </div>
//           <JobForm
//             type="add"
//             selectedBusiness={selectedBusiness}
//             setSelectedBusiness={setSelectedBusiness}
//             trigger={
//               <Button className="flex items-center gap-2">
//                 <CirclePlus size={14} /> Create Business
//               </Button>
//             }
//           />
//         </div>
//         <TabsContent value="all">
//           <ScrollArea className="h-[calc(100vh-200px)]">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 p-4 pt-0">
//               {isPending
//                 ? Array.from(Array(2).keys()).map((item) => (
//                     <Card key={item}>
//                       <div className="flex flex-col gap-6 p-6">
//                         <div className="flex items-center justify-between space-x-4">
//                           <div className="space-y-2">
//                             <Skeleton className="h-4 w-60" />
//                             <Skeleton className="h-4 w-24" />
//                           </div>
//                           <Skeleton className="w-16 h-6 rounded-lg" />
//                         </div>
//                         <div className="flex flex-col space-y-3">
//                           <div className="space-y-2">
//                             <Skeleton className="h-4" />
//                             <Skeleton className="h-4" />
//                             <Skeleton className="h-4" />
//                             <Skeleton className="h-4" />
//                           </div>
//                         </div>
//                       </div>
//                     </Card>
//                   ))
//                  : businesses.map((item) => <BusinessCard key={item._id} item={item} />)}
//             </div>
//           </ScrollArea>
//         </TabsContent>
//         <TabsContent value="mine">
//           <ScrollArea className="h-[calc(100vh-200px)]">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 p-4 pt-0">
//               {isPending ? (
//                 Array.from(Array(2).keys()).map((item) => (
//                   <Card key={item}>
//                     <div className="flex flex-col gap-6 p-6">
//                       <div className="flex items-center justify-between space-x-4">
//                         <div className="space-y-2">
//                           <Skeleton className="h-4 w-60" />
//                           <Skeleton className="h-4 w-24" />
//                         </div>
//                         <Skeleton className="w-16 h-6 rounded-lg" />
//                       </div>
//                       <div className="flex flex-col space-y-3">
//                         <div className="space-y-2">
//                           <Skeleton className="h-4" />
//                           <Skeleton className="h-4" />
//                           <Skeleton className="h-4" />
//                           <Skeleton className="h-4" />
//                         </div>
//                       </div>
//                     </div>
//                   </Card>
//                 ))
//               ) : businesses.filter((b) => b.userId._id === auth.user._id).length >
//                 0 ? (
//                     businesses
//                   .filter((b) => b.userId._id === auth.user._id)
//                   .map((item) => (
//                     <Card
//                       key={item._id}
//                       className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent/10"
//                     >
//                       <div className="flex w-full flex-col gap-1">
//                         <div className="flex items-center">
//                           <div className="flex items-center gap-2">
//                             <div className="font-semibold text-xl">
//                               {item.name}
//                             </div>
//                           </div>
//                           <div
//                             className={cn(
//                               "ml-auto text-xs text-accent hover:!text-primary flex items-center gap-2"
//                             )}
//                           >
//                             {item.isClosed ? (
//                               <Badge
//                                 variant="destructive"
//                                 className="text-white font-light"
//                               >
//                                 Closed
//                               </Badge>
//                             ) : (
//                               <Badge variant="" className="font-light">
//                                 Open
//                               </Badge>
//                             )}
//                             {moment(item.createdAt).startOf().fromNow()}
//                           </div>
//                         </div>
//                         <div className="text-xs font-semibold">
//                           Location:{" "}
//                           <span className="font-medium">
//                             {item.country} | {item.city}
//                           </span>
//                         </div>
//                         <div className="text-xs font-semibold">
//                           Field:{" "}
//                           <span className="font-medium">
//                             {item.occupation} | {item.subOccupation}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="text-xs text-muted font-semibold">
//                         Description:{" "}
//                         <span className="font-medium">
//                           {item.description.substring(0, 300)}
//                         </span>
//                       </div>
//                       <div className="text-xs text-muted font-semibold">
//                         Salary:{" "}
//                         <span className="font-medium">{item.salary}$</span>
//                       </div>
//                       {isMyBusinesses ? (
//                         <div className="flex items-center">
//                           <JobForm
//                             type="edit"
//                             selectedBusiness={selectedBusiness}
//                             setSelectedBusiness={setSelectedBusiness}
//                             trigger={
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 className="flex items-center gap-2"
//                                 type="button"
//                                 onClick={() => setSelectedBusiness(item)}
//                               >
//                                 <Edit size={14} /> Edit
//                               </Button>
//                             }
//                           />

//                           {item.isClosed ? null : (
//                             <ConfirmDelete
//                               isClose
//                               onDelete={deleteJob}
//                               open={openConfirm}
//                               setOpen={setOpenConfirm}
//                               Icon={CircleX}
//                               isClosed={item.isClosed}
//                             />
//                           )}
//                         </div>
//                       ) : null}
//                     </Card>
//                   ))
//               ) : (
//                 <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
//                   <h3 className="text-3xl lg:text-4xl font-semibold">
//                     No Businesses Found
//                   </h3>
//                   <p className="text-black/70">
//                     Add your first business from the form at your left
//                   </p>
//                 </div>
//               )}
//             </div>
//           </ScrollArea>
//         </TabsContent>
//       </Tabs>
//     </main>
//   );
// }
