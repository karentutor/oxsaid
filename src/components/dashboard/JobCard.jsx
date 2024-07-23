/* eslint-disable react/prop-types */
import moment from "moment";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ConfirmDelete } from "./FeedItem";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import { axiosBase } from "@/services/BaseService";
import { toast } from "sonner";
import { CircleX, Edit } from "lucide-react";

export default function JobCard({
  item,
  myJob = false,
  setSelectedState,
  setFormStatus,
  selectedJob,
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { auth } = useAuth();

  // Delete Job
  const { mutate: deleteJob } = useMutation({
    mutationFn: () =>
      axiosBase.put(
        `/jobs/${item._id}/close`,
        {},
        {
          headers: { Authorization: auth.access_token },
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myJobs"] });
      toast.success("Job Closed successfully");
      setOpen(false);
    },
    onError: () => toast.error("Something went wrong"),
  });

  const handleEdit = () => {
    setSelectedState(item);
    setFormStatus("edit");
  };

  return (
    <Card
      className={`flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent/10 ${
        selectedJob?._id === item._id ? "border-accent bg-accent/10" : ""
      }`}
    >
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="font-semibold text-xl">{item.jobTitle}</div>
          </div>
          <div
            className={cn(
              "ml-auto text-xs text-accent hover:!text-primary flex items-center gap-2"
            )}
          >
            {item.isClosed ? (
              <Badge variant="destructive" className="text-white font-light">
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
        Salary: <span className="font-medium">{item.salary}$</span>
      </div>
      {myJob ? (
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleEdit}
          >
            <Edit size={14} /> Edit
          </Button>
          {item.isClosed ? null : (
            <ConfirmDelete
              isClose
              onDelete={deleteJob}
              open={open}
              setOpen={setOpen}
              Icon={CircleX}
              isClosed={item.isClosed}
            />
          )}
        </div>
      ) : null}
    </Card>
  );
}
