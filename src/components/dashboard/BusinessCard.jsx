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
import BusinessForm from "./businesses/business-form";

export default function BusinessCard({ item, myJob = false }) {
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


  return (
    <Card className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent/10">
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="font-semibold text-xl">{item.name}</div>
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
          Address:{" "}
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
          <BusinessForm
            type="edit"
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                type="button"
              >
                <Edit size={14} /> Edit
              </Button>
            }
            open={open}
            setOpen={setOpen}
          />

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



// import React from 'react';

// const BusinessCard = ({ item }) => {
//   return (
//     <div className="business-card">
//       <h2>{item.name.name}</h2> {/* Display the business name */}
//       <p>Address: {item.address}</p>
//       <p>Phone: {item.phone}</p>
//       <p>Email: {item.email}</p>
//       <p>Description: {item.description}</p>
//       <p>Size: {item.size}</p>
//       <p>Is Alumni Owned: {item.isAlumniOwned ? 'Yes' : 'No'}</p>
//       <p>Visibility: {item.visibility}</p>
//       <p>Year Founded: {item.yearFounded}</p>
//       <p>Occupation: {item.occupation}</p>
//       <p>Sub-Occupation: {item.subOccupation}</p>
//       <p>Created At: {new Date(item.createdAt).toLocaleString()}</p>
//       <p>
//         Website URL: <a href={item.websiteUrl}>{item.websiteUrl}</a>
//       </p>
//       <p>
//         Picture: <img src={item.picturePath} alt={item.name.name} style={{ width: '100px', height: '100px' }} />
//       </p>
//     </div>
//   );
// };

// export default BusinessCard;
