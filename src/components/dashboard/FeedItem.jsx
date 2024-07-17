import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "../ui/card";
import { UserAvatar } from "./UserAvatar";
import { Heart, MessageSquareIcon, Trash } from "lucide-react";
import { axiosBase } from "@/services/BaseService";
import useAuth from "@/hooks/useAuth";
import { HeartIcon, HeartFilledIcon } from "@radix-ui/react-icons";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useState } from "react";
import moment from "moment";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export function ConfirmDelete({
  open,
  setOpen,
  onDelete,
  isClose = false,
  isClosed = false,
  Icon = Trash,
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="text-white ms-4 mr-auto"
          size="icon"
          disabled={isClosed}
        >
          <Icon size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isClose ? "Close" : "Delete"} Item</DialogTitle>
        </DialogHeader>
        Are you sure you want to {isClose ? "close" : "delete"} this Item?
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="submit">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            variant="destructive"
            className="text-white"
            type="submit"
          >
            {isClose ? "Close" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const FeedItem = ({
  _id,
  userId,
  likes,
  picturePath,
  firstName,
  lastName,
  comments,
  userPicturePath,
  createdAt,
  location,
  description,
}) => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Like
  const { mutate: likePost } = useMutation({
    mutationFn: () =>
      axiosBase.put(
        `/posts/${_id}/like`,
        { userId: auth.user._id },
        { headers: { Authorization: auth.access_token } }
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });

  // Comment
  const { mutate: commentOnPost } = useMutation({
    mutationFn: () =>
      axiosBase.put(
        `/posts/${_id}/comment`,
        { userId: auth.user._id, text: comment },
        { headers: { Authorization: auth.access_token } }
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["posts"] }),
    onSettled: () => setComment(""),
  });

  // Delete Post
  const { mutate: deletePost } = useMutation({
    mutationFn: () =>
      axiosBase.delete(`/posts/${_id}`, {
        headers: { Authorization: auth.access_token },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully");
    },
    onError: () => {
      toast.error("Something went wrong");
      setIsDeleting(false);
    },
    onSettled: () => setIsDeleting(false),
  });

  const handleDelete = () => {
    setIsDeleting(true);
    deletePost();
  };

  return (
    <Card className="p-0 mt-2 max-w-[600px]">
      <div className="flex flex-row p-4">
        <UserAvatar imageUrl={userPicturePath} />
        <div className="pl-4">
          <div className="flex flex-row items-center">
            <div className="font-semibold">
              {firstName} {lastName}
            </div>
            <div className="ml-2 text-muted text-xs">• {location}</div>
          </div>
          <div className="text-xs text-zinc-500">
            {moment(createdAt).startOf().fromNow()}
          </div>
        </div>
      </div>
      <div className="p-4 text-sm pt-0">{description}</div>
      {picturePath && <img src={picturePath} className="w-full h-auto" />}
      <div className="text-zinc-500 text-xs p-2 px-4 flex items-center border-b">
        <div className="flex items-center justify-between w-full">
          {Object.keys(likes)?.length ? (
            <div className="w-full flex flex-row items-center hover:text-blue-600 hover:underline cursor-pointer">
              <Heart size={15} />
              <span className="ml-1">{Object.keys(likes)?.length}</span>
            </div>
          ) : null}
          {comments?.length ? (
            <div className="hover:text-blue-600 hover:underline cursor-pointer shrink-0">
              {comments?.length} comments
            </div>
          ) : null}
        </div>
        {userId === auth.user._id ? (
          <ConfirmDelete
            open={open}
            setOpen={setOpen}
            onDelete={handleDelete}
            isClosed={isDeleting}
            Icon={isDeleting ? () => <Skeleton className="w-5 h-5" /> : Trash}
          />
        ) : null}
      </div>
      <Collapsible>
        <div className="flex flex-row justify-between items-center py-2 px-4">
          <button
            onClick={() => likePost()}
            className="p-2 rounded hover:bg-zinc-200 flex flex-row text-zinc-500 text-sm items-center cursor-pointer transition-all"
          >
            <span>
              {Object.keys(likes)?.includes(auth.user._id) ? (
                <HeartFilledIcon className="text-red-500" />
              ) : (
                <HeartIcon />
              )}
            </span>
            <span
              className={`font-semibold ml-2 hidden sm:inline ${
                Object.keys(likes)?.includes(auth.user._id)
                  ? "text-red-500"
                  : ""
              }`}
            >
              Like
            </span>
          </button>
          <CollapsibleTrigger>
            <div className="p-2 rounded hover:bg-zinc-200 flex flex-row text-zinc-500 text-sm items-center cursor-pointer transition-all">
              <span>{<MessageSquareIcon />}</span>
              <span className="font-semibold ml-2 hidden sm:inline">
                Comment
              </span>
            </div>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="flex flex-col gap-2 items-start px-4 pb-4">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="give your thoughts"
            />
            <Button disabled={comment?.length < 2} onClick={() => commentOnPost()}>
              Submit
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
