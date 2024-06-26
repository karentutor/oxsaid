/* eslint-disable react/prop-types */
import {
  ChevronDown,
  ChevronRightIcon,
  InfoIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-react";
import { UserAvatar } from "./UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Card, CardHeader } from "../ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosBase } from "@/services/BaseService";
import useAuth from "@/hooks/useAuth";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import { Button } from "../ui/button";

export const UserRecommendation = ({
  firstName,
  lastName,
  picturePath,
  occupation,
  location,
  _id,
}) => {
  const { auth, setAuth } = useAuth();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      axiosBase.get(`/users/${auth.user._id}`, {
        headers: { Authorization: auth.access_token },
      }),
    select: (data) => data.data.user,
  });

  // Follow
  const { mutate: followConnection } = useMutation({
    mutationFn: (connectionId) =>
      axiosBase.patch(
        `/users/${auth.user._id}/${connectionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.access_token}`,
          },
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setAuth((prev) => ({ ...prev, user }));
      toast.success("Connection added to your list");
    },
    onError: () => toast.success("Connection added to your list"),
  });
  return (
    <div className="grid grid-cols-[auto_1fr_auto] justify-between w-full p-3">
      <UserAvatar imageUrl={picturePath} />
      <div className="ml-2">
        <div className="font-semibold text-sm">
          {firstName} {lastName}
        </div>
        <div className="text-xs text-zinc-500 mb-2">
          {location}, {occupation}
        </div>
      </div>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => followConnection(_id)}
              variant={
                auth.user.friends.includes(_id) ? "destructive" : "outline"
              }
              size="icon"
              className="ms-2"
            >
              {auth.user.friends.includes(_id) ? (
                <MinusIcon size={18} className="text-white" />
              ) : (
                <PlusIcon size={18} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {auth.user.friends.includes(_id) ? "Unfollow" : "Follow"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

const AsideFooterLink = ({ text, subItems }) => {
  return (
    <span className="m-1 cursor-pointer hover:underline hover:text-blue-500 ">
      {subItems ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span className="flex flex-row">
              {text}
              <ChevronDown size={15} />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {subItems.map((item) => (
              <DropdownMenuItem key={item.text}>
                <span>{item.text}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        text
      )}
    </span>
  );
};

const AsideFooter = () => {
  return (
    <div className="text-xs text-zinc-500 flex flex-wrap p-4 m-2 justify-center sticky top-14">
      <AsideFooterLink text="About" />
      <AsideFooterLink text="Accessibility" />
      <AsideFooterLink text="Help Center" />
      <AsideFooterLink
        text="Privacy & Terms"
        subItems={[
          {
            text: "Privacy Policy",
            href: "#",
          },
          {
            text: "User Agreement",
            href: "#",
          },
          {
            text: "Pages Terms",
            href: "#",
          },
          {
            text: "Cookie Policy",
            href: "#",
          },
          {
            text: "Copyright Policy",
            href: "#",
          },
        ]}
      />
      <AsideFooterLink text="Ad Choices" />
      <AsideFooterLink text="Advertising" />
      <AsideFooterLink text="Business Services" />
    </div>
  );
};

export const Aside = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { auth } = useAuth();

  const { data: users, isPending } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      axiosBase.get(`/users`, {
        headers: { Authorization: auth.access_token },
      }),
    select: (data) => data.data?.filter((u) => u._id !== auth.user._id),
  });

  return (
    <aside className="[grid-area:aside]">
      <Card>
        <CardHeader className="p-3 flex flex-row">
          <div className="font-semibold w-full">Connection List</div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild className="cursor-pointer">
                <InfoIcon size={16} />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-48">
                  Follow connections that interest you to personalize your feed.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="space-y-2"
        >
          {isPending ? (
            <div className="flex flex-col gap-6 p-6">
              {Array.from(Array(2).keys()).map((item) => (
                <div key={item} className="grid grid-cols-[auto_1fr] space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-56" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            users
              ?.slice(0, 2)
              .map((user) => <UserRecommendation key={user._id} {...user} />)
          )}
          <CollapsibleContent className="space-y-2">
            {users?.slice(2, 7).map((user) => (
              <UserRecommendation key={user._id} {...user} />
            ))}
          </CollapsibleContent>
          <CollapsibleTrigger asChild>
            <div className="mt-1 ml-3 text-zinc-500 flex flex-row text-sm p-2 items-center font-semibold cursor-pointer">
              {isOpen
                ? "View less recommendations"
                : "View all recommendations"}{" "}
              <ChevronRightIcon size={18} />
            </div>
          </CollapsibleTrigger>
        </Collapsible>
      </Card>
      <AsideFooter />
    </aside>
  );
};
