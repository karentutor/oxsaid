/* eslint-disable react/prop-types */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "../ui/card";
import { UserAvatar } from "./UserAvatar";
import { Heart, MessageSquareIcon } from "lucide-react";
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

function extractDomain(url) {
  const urlObj = new URL(url);
  return urlObj.hostname;
}

export const FeedItem = ({
  id,
  likes,
  content,
  thumbnail,
  link,
  author,
  stats,
}) => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");

  // Like
  const { mutate: likePost } = useMutation({
    mutationFn: () =>
      axiosBase.put(
        `/posts/${id}/like`,
        { userId: auth.user._id },
        { headers: { Authorization: auth.access_token } }
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });

  // Comment
  const { mutate: commentOnPost } = useMutation({
    mutationFn: () =>
      axiosBase.put(
        `/posts/${id}/comment`,
        { userId: auth.user._id, text: comment },
        { headers: { Authorization: auth.access_token } }
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
    onSettled: () => setComment(""),
  });

  return (
    <Card className="p-0 mt-2">
      <div className="flex flex-row p-4">
        <UserAvatar imageUrl={author.imageUrl} />
        <div className="pl-4">
          <div className="flex flex-row items-center">
            <div className="font-semibold">{author.name}</div>
            <div className="ml-2 text-muted text-xs">
              • {author.connectionDegree}
            </div>
          </div>
          <div className="text-xs text-zinc-500">{author.subtext}</div>
        </div>
      </div>
      <div className="p-4 text-sm pt-0">{content}</div>
      {thumbnail && <img src={thumbnail} className="w-full h-auto" />}
      {link && (
        <>
          <img src={link.thumbnail} className="w-full h-auto" />
          <div className="p-4 bg-slate-200">
            <div className="text-sm font-semibold">{link.title}</div>
            <div className="text-xs text-zinc-500 mt-1">
              {link.href && extractDomain(link.href)}
            </div>
          </div>
        </>
      )}
      {stats ? (
        <div className="text-zinc-500 text-xs p-2 px-4 flex flex-row items-center border-b">
          {stats.likes ? (
            <div className="w-full flex flex-row items-center hover:text-blue-600 hover:underline cursor-pointer">
              <Heart size={15} />
              <span className="ml-1">{stats.likes}</span>
            </div>
          ) : null}
          {stats.comments ? (
            <div className="hover:text-blue-600 hover:underline cursor-pointer shrink-0">
              {stats.comments} comments
            </div>
          ) : null}
        </div>
      ) : null}
      <Collapsible>
        <div className="flex flex-row justify-between items-center py-2 px-4">
          <button
            onClick={likePost}
            className="p-2 rounded hover:bg-zinc-200 flex flex-row text-zinc-500 text-sm items-center cursor-pointer transition-all"
          >
            <span>
              {Object.keys(likes)?.includes(auth.user._id) ? (
                <HeartFilledIcon />
              ) : (
                <HeartIcon />
              )}
            </span>
            <span className="font-semibold ml-2 hidden sm:inline">Like</span>
          </button>
          <CollapsibleTrigger>
            <button className="p-2 rounded hover:bg-zinc-200 flex flex-row text-zinc-500 text-sm items-center cursor-pointer transition-all">
              <span>{<MessageSquareIcon />}</span>
              <span className="font-semibold ml-2 hidden sm:inline">
                Comment
              </span>
            </button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="flex flex-col gap-2 items-start px-4 pb-4">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="give your thoughts"
            />
            <Button disabled={comment.length < 2} onClick={commentOnPost}>
              Submit
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
