import GroupCard from "@/components/dashboard/GroupCard";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import useAuth from "@/hooks/useAuth";
import { axiosBase } from "@/services/BaseService";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function ProfileGroups() {
  const { id } = useParams();
  const { auth } = useAuth();
  const { data: groupes, isPending } = useQuery({
    queryKey: ["myGroups", id],
    queryFn: () =>
      axiosBase.get(`/groups/${id}`, {
        headers: { Authorization: auth.access_token },
      }),
    enabled: !!id,
    select: (data) => data.data?.group,
  });
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Groups</h3>
        <p className="text-sm text-muted">Manage your groupss.</p>
      </div>
      <Separator />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 pt-0">
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
        ) : groupes?.length > 0 ? (
          groupes.map((item) => (
            <GroupCard key={item._id} item={item} isAdmin />
          ))
        ) : (
          <h3 className="text-center text-xl mt-10">No Groups Found</h3>
        )}
      </div>
    </div>
  );
}
