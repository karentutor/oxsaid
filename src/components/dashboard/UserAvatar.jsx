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

export const MyAvatar = ({ className }) => (
  <UserAvatar
    className={className}
    imageUrl="https://media.licdn.com/dms/image/D4E03AQGEu93ehaEucA/profile-displayphoto-shrink_100_100/0/1675407583125?e=1692835200&v=beta&t=qe1mCCS79H25N_h_VTUtEZ_XoslNvPv30y3QPv8rS8U"
  />
);
