/* eslint-disable react/prop-types */
import useAuth from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const UserAvatar = ({ imageUrl, className }) => {
  return (
    <Avatar className={className}>
      <AvatarImage src={imageUrl} />
      <AvatarFallback className="bg-accent text-white border">
        YO
      </AvatarFallback>
    </Avatar>
  );
};

export const MyAvatar = ({ className }) => {
  const { auth } = useAuth();
  return <UserAvatar className={className} imageUrl={auth.user?.picturePath} />;
};
