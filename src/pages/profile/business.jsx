import BusinessCard from "@/components/dashboard/BusinessCard";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import useAuth from "@/hooks/useAuth";
import { axiosBase } from "@/services/BaseService";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function ProfileBusiness() {
  const { id } = useParams();
  const { auth } = useAuth();
  const { data: businesses, isPending } = useQuery({
    queryKey: ["myBusinesses", id],
    queryFn: () =>
      axiosBase.get(`/businesses/${id}`, {
        headers: { Authorization: auth.access_token },
      }),
    enabled: !!id,
    select: (data) => data.data?.business,
  });
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Business</h3>
        <p className="text-sm text-muted">Manage your businesses.</p>
      </div>
      <Separator />
      {isPending ? (
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-60" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[225px]  rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
            </div>
          </div>
        </div>
      ) : businesses?.length > 0 ? (
        businesses.map((item) => (
          <BusinessCard key={item._id} item={item} myBusiness />
        ))
      ) : (
        <h3 className="text-center text-xl mt-10">No Businesses Found</h3>
      )}
    </div>
  );
}
