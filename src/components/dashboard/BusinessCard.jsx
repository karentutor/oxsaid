/* eslint-disable react/prop-types */
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import moment from "moment";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosBase } from "@/services/BaseService";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { ConfirmDelete } from "./FeedItem";
import { useState } from "react";

export default function BusinessCard({ item, myBusiness = false }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { auth } = useAuth();

  // Delete Business
  const { mutate: deleteBusiness } = useMutation({
    mutationFn: () =>
      axiosBase.delete(`/businesses/${item._id}`, {
        headers: { Authorization: auth.access_token },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBusinesses"] });
      toast.success("Business deleted successfully");
      setOpen(false);
    },
    onError: () => toast.error("Something went wrong"),
  });

  return (
    <Card
      className={cn(
        "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent/10"
      )}
    >
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center">
          <div className="flex items-center justify-between gap-2">
            <div className="font-semibold text-lg">{item.name.name}</div>
            {item.isLessThanTwoYears && (
              <span className="flex h-2 w-2 rounded-full bg-blue-600" />
            )}
          </div>
          <div
            className={cn(
              "ml-auto text-xs text-accent hover:!text-primary flex items-center gap-4"
            )}
          >
            <Badge className="ml-auto">{item.visibility}</Badge>
            {moment(item.createdAt).startOf().fromNow()}
          </div>
        </div>
        <div className="text-sm font-semibold">
          address: <span className="font-medium">{item.address}</span>
        </div>
        <div className="text-sm font-semibold">
          field:{" "}
          <span className="font-medium">
            {item.occupation} | {item.subOccupation}
          </span>
        </div>
        <div className="text-sm font-semibold">
          created by:{" "}
          <span className="font-medium">
            {item.userId.firstName} {item.userId.lastName}
          </span>
        </div>
      </div>
      <div className="line-clamp-2 font-semibold text-sm">
        description:{" "}
        <span className="font-medium">
          {item.description.substring(0, 300)}
        </span>
      </div>
      {myBusiness ? (
        <div className="flex items-center">
          <Button size="icon" variant="outline">
            <Edit size={14} />
          </Button>
          <ConfirmDelete
            onDelete={deleteBusiness}
            open={open}
            setOpen={setOpen}
          />
        </div>
      ) : null}
    </Card>
  );
}
