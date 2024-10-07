/* eslint-disable react/prop-types */
import moment from "moment";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ConfirmDelete } from "./FeedItem";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { axiosBase } from "@/services/BaseService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import { Edit } from "lucide-react";
import GroupForm from "./groups/group-form";
import { defaultGroup } from "@/pages/groups";

export default function GroupCard({
  item,
  onDelete,
  isMyGroup = false,
  isAdmin = false,
}) {
  const [open, setOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(defaultGroup);
  const queryClient = useQueryClient();
  const { auth } = useAuth();

  // Delete Group
  const { mutate: deleteGroup } = useMutation({
    mutationFn: () =>
      axiosBase.delete(`/groups/${item._id}`, {
        headers: { Authorization: auth.access_token },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
      toast.success("Group deleted successfully");
      setOpen(false);
    },
    onError: () => toast.error("Something went wrong"),
  });

  return (
    <Card key={item._id}>
      <CardHeader className="relative p-2">
        <img
          src={item.groupCoverImage || "/imgs/about.jpg"}
          alt={item.title}
          className="rounded-lg object-cover border"
        />
        <div
          className={cn(
            "ml-auto text-xs text-accent hover:!text-primary absolute top-2 right-4 bg-background py-0.5 px-2 rounded-2xl"
          )}
        >
          {moment(item.createdAt).startOf().fromNow()}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex w-full flex-col items-start gap-2">
          <h4 className="font-semibold">{item.name}</h4>
          <p className="text-xs font-medium text-accent">{item.type}</p>
          <p className="text-xs text-muted font-semibold">
            members:{" "}
            <span className="font-medium">{item.groupMembers?.length}</span>
          </p>
          <p className="text-xs text-muted font-semibold">
            created by:{" "}
            <span className="font-medium">
              {item.userId?.firstName} {item.userId?.lastName}
            </span>
          </p>
          <p className="line-clamp-2 text-xs text-muted">
            {item.description.substring(0, 300)}
          </p>
          <div className="flex items-center justify-between w-full">
            {item?.isPrivate ? <Badge>Private</Badge> : <Badge>Public</Badge>}
            {isAdmin ? (
              <div className="flex items-center">
                <Button size="icon" variant="outline">
                  <Edit size={14} />
                </Button>
                <ConfirmDelete
                  onDelete={deleteGroup}
                  open={open}
                  setOpen={setOpen}
                />
              </div>
            ) : null}
          </div>
          {isMyGroup ? (
            <div className="flex items-center">
              <GroupForm
                type="edit"
                selectedGroup={selectedGroup}
                setSelectedGroup={setSelectedGroup}
                trigger={
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    type="button"
                    onClick={() => setSelectedGroup(item)}
                  >
                    <Edit size={14} /> Edit
                  </Button>
                }
              />
              <ConfirmDelete onDelete={onDelete} />
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
