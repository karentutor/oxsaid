import { MyAvatar } from "./UserAvatar";
import { Image } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosBase } from "@/services/BaseService";
import useAuth from "@/hooks/useAuth";

const WriteNewPostCardButtonContainer = ({ children }) => {
  return (
    <div className="cursor-pointer hover:bg-zinc-100 rounded flex px-2 flex-row items-center justify-center">
      {children}
    </div>
  );
};

const Action = ({ icon, tooltipText }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className="cursor-pointer">
          <div
            className={cn(
              "rounded-full bg-zinc-100 transition-all p-2.5 text-zinc-500"
            )}
          >
            <span className="w-5 h-5 flex items-center justify-center">
              {icon}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const PostBottomActions = () => {
  return (
    <div className="flex flex-row items-center">
      <Action icon={<Image />} tooltipText="Add a photo" />
    </div>
  );
};

const WriteNewPostDialog = ({ onClose }) => {
  const [text, setText] = useState("");
  const [postPic, setPostPic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const isPostButtonDisabled = (text === "" && !postPic) || isLoading || isSubmitting;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setPostPic(file);
    setIsLoading(true); // Set loading state to true when file is selected
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setIsLoading(false); // Set loading state to false when preview is ready
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      setIsLoading(false);
    }
  };

  const { mutate: createPost } = useMutation({
    mutationFn: () =>
      axiosBase.post(
        `/posts`,
        {
          userId: auth.user._id,
          description: text,
          picture: postPic,
          picturePath: postPic?.name || "",
        },
        {
          headers: {
            Authorization: auth.access_token,
            "Content-Type": "multipart/form-data",
          },
        }
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
    onSettled: () => {
      setText("");
      setPostPic(null);
      setPreview(null);
      setIsSubmitting(false);
      onClose();
    },
  });

  const handleSubmit = () => {
    setIsSubmitting(true);
    createPost();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="top-44 p-0 m-0">
        <div className="px-6 pt-6">
          <div className="flex flex-row items-center">
            <MyAvatar />
            <div className="ml-3">
              <div className="text-lg font-semibold">
                {auth.user?.firstName} {auth.user?.lastName}
              </div>
              <div className="text-sm">Post to anyone</div>
            </div>
          </div>
          <Textarea
            placeholder="What do you want to talk about?"
            className="border-none outline-none text-lg p-0 text-zinc-600 placeholder:text-gray-500 mt-5 resize-none"
            style={{ "--tw-ring-color": "transparent" }}
            rows={2}
            onChange={(e) => setText(e.target.value)}
          />
          {preview && (
            <div className="mt-4">
              <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded" />
            </div>
          )}
          <Label htmlFor="postPic">
            <PostBottomActions />
          </Label>
          <Input
            id="postPic"
            onChange={handleFileChange}
            type="file"
            className="hidden"
          />
        </div>
        <Separator className="pt-0 mt-0" />
        <div className="flex flex-row p-3 pt-0">
          <div className="w-full" />
          <Button
            className={cn(
              "rounded-3xl font-semibold",
              !isPostButtonDisabled && "bg-accent"
            )}
            onClick={handleSubmit}
            disabled={isPostButtonDisabled}
          >
            {isSubmitting ? "Posting..." : isLoading ? "Loading..." : "Post"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const NewPostCard = () => {
  const [isWriteDialogOpen, setWriteDialogOpen] = useState(false);
  return (
    <Card className="p-4">
      <div className="flex flex-row">
        <MyAvatar />
        <Input
          placeholder="Start a post"
          className="rounded-3xl ml-2 h-12 font-semibold text-zinc-500 hover:bg-zinc-100 transition-all cursor-pointer"
          onClick={() => setWriteDialogOpen(true)}
        />
        {isWriteDialogOpen && (
          <WriteNewPostDialog onClose={() => setWriteDialogOpen(false)} />
        )}
      </div>
      <div className="flex flex-row justify-between mt-3">
        <WriteNewPostCardButtonContainer>
          <span className="text-accent">
            <Image />
          </span>
          <span className="font-semibold text-zinc-500 ml-2 text-sm">
            Photo
          </span>
        </WriteNewPostCardButtonContainer>
        <Button
          size="sm"
          variant="outline"
          className="text-primary rounded-full"
        >
          POST
        </Button>
      </div>
    </Card>
  );
};
