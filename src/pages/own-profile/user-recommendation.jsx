/* eslint-disable react/prop-types */
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosBase } from "@/services/BaseService";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { UserAvatar } from "@/components/dashboard/UserAvatar";

const UserRecommendation = ({
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
    onError: () => toast.error("Failed to add connection"),
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

export default UserRecommendation;
