import React from "react";
import UserRecommendation from "./user-recommendation"; // Ensure correct casing and path
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import useAuth from "@/hooks/useAuth";
import { axiosBase } from "@/services/BaseService";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function ConnectionList() {
  const { auth } = useAuth();
  const { id } = useParams();

  const { data: friends, isPending } = useQuery({
    queryKey: ["friends", id],
    queryFn: () =>
      axiosBase.get(`/users/${id}/friends`, {
        headers: { Authorization: auth.access_token },
      }),
    select: (data) => data.data.friends,
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Connection List</h3>
        <p className="text-sm text-muted">
          Manage your connection list & preferences.
        </p>
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
            <Skeleton className="h-[225px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
            </div>
          </div>
        </div>
      ) : friends?.length > 0 ? (
        friends.map((item) => (
          <Card key={item._id}>
            <UserRecommendation {...item} />
          </Card>
        ))
      ) : (
        <h3 className="text-center text-xl mt-10">No Connections Found</h3>
      )}
    </div>
  );
}
