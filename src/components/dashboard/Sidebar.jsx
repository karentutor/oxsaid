/* eslint-disable react/prop-types */
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { UserAvatar } from "./UserAvatar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { axiosBase } from "@/services/BaseService";

const MyProfileHeader = () => {
  const { auth } = useAuth();
  return (
    <div>
      <div
        className="bg-center bg-cover block h-14 w-full"
        style={{
          backgroundImage:
            "url(https://media.licdn.com/dms/image/C5616AQFBJ6o2Z7TrsQ/profile-displaybackgroundimage-shrink_200_800/0/1516968055361?e=1692835200&v=beta&t=MEqhkc8BTKOniiPx0Hphp_pXKJ-0GH6OWaaKLurI8Qc)",
        }}
      ></div>
      <div className="flex justify-center">
        <UserAvatar
          className="w-16 h-16 rounded-full overflow-hidden border-white border-2 mt-[-32px] z-1"
          imageUrl={auth.user.picturePath}
        />
      </div>
    </div>
  );
};

const MyProfileStats = ({ text, count }) => {
  return (
    <div className="flex flex-row items-center text-xs font-semibold px-3 p-1 cursor-pointer hover:bg-zinc-200">
      <div className="w-full text-zinc-500">{text}</div>
      <div className="text-accent">{count}</div>
    </div>
  );
};

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid Email" }),
});
const Form2Schema = z.object({
  email: z.string().email({ message: "Invalid Email" }),
});

const MyItems = () => {
  const domainName = window.location.origin;
  const { auth } = useAuth();
  // Invite a Friend
  const { mutate: inviteFriend } = useMutation({
    mutationFn: (data) =>
      axiosBase.post(
        `/auth/invite-friend`,
        { userId: auth.user._id, email: data.email, domainName },
        { headers: { Authorization: auth.access_token } }
      ),
    onSuccess: () => toast.success("Invite send"),
    onError: () => toast.error("Something went wrong"),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const form2 = useForm({
    resolver: zodResolver(Form2Schema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <div className="flex flex-col gap-3 text-xs font-semibold p-3 text-zinc-500">
      <h5 className="">Invite SBS Alums</h5>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(inviteFriend)}
          className="flex items-center gap-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem size="sm" className="w-full">
                <FormControl>
                  <Input
                    size="sm"
                    placeholder="Email"
                    className="h-8 placeholder:text-xs placeholder:font-light"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <Button type="submit" size="sm" className="h-8 text-xs">
            Send
          </Button>
        </form>
      </Form>
      <Form {...form2}>
        <form
          onSubmit={form2.handleSubmit(inviteFriend)}
          className="flex items-center gap-2"
        >
          <FormField
            control={form2.control}
            name="email"
            render={({ field }) => (
              <FormItem size="sm" className="w-full">
                <FormControl>
                  <Input
                    size="sm"
                    placeholder="Email"
                    className="h-8 placeholder:text-xs placeholder:font-light"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="sm" className="h-8 text-xs">
            Send
          </Button>
        </form>
      </Form>
    </div>
  );
};

const Discover = () => {
  const discoverItem =
    "font-semibold text-accent text-xs p-3 py-2 hover:underline block";
  return (
    <Card className="pt-1 mt-2">
      <Link to="/groups" className={discoverItem}>
        Groups
      </Link>
      <Link to="/events" className={discoverItem}>
        Events
      </Link>
      <Link to="/funding" className={discoverItem}>
        Funding
      </Link>
      <div className="border-t hover:bg-zinc-100 text-sm font-semibold text-zinc-500 p-3 text-center cursor-pointer transition-all">
        Discover more
      </div>
    </Card>
  );
};

const SidebarDesktopLayout = () => {
  const { auth } = useAuth();
  return (
    <>
      <Card className="overflow-hidden">
        <MyProfileHeader />
        <a
          className="flex justify-center items-center flex-col mt-4 pb-4 border-b"
          href="https://www.linkedin.com/in/ozgurgul35/"
          target="_blank"
        >
          <div className="text-md font-medium hover:underline cursor-pointer">
            {auth.user.firstName} {auth.user.lastName}
          </div>
          <div className="text-xs text-zinc-500 mt-1">
            {auth.user.subOccupation}
          </div>
          <div className="text-xs mt-1">{auth.user.location}</div>
        </a>
        <div>
          <div className="py-3 border-b">
            <MyProfileStats
              text="Who's viewed your profile"
              count={auth.user.viewedProfile}
            />
            <MyProfileStats
              text="Impressions of your post"
              count={auth.user.impressions}
            />
          </div>
          <MyItems />
        </div>
      </Card>
      <div className="sticky top-16">
        <Discover />
      </div>
    </>
  );
};

const SidebarMobileLayout = () => {
  const [isShowingAllMobile, setShowingAllMobile] = useState(false);
  const { auth } = useAuth();
  console.log("auth", auth);
  return (
    <>
      <Card className="overflow-hidden">
        <MyProfileHeader />
        <a
          className="flex justify-center items-center flex-col mt-4 pb-4 border-b"
          href="https://www.linkedin.com/in/ozgurgul35/"
          target="_blank"
        >
          <div className="text-md font-medium hover:underline cursor-pointer">
            {auth.user.firstName} {auth.user.lastName}
          </div>
          <div className="text-xs text-zinc-500 mt-1">
            {auth.user.subOccupation}
          </div>
          <div className="text-xs mt-1">{auth.user.location}</div>
        </a>
        {isShowingAllMobile && (
          <div>
            <div className="py-3 border-b">
              <MyProfileStats
                text="Who's viewed your profile"
                count={auth.user.viewedProfile}
              />
              <MyProfileStats
                text="Impressions of your post"
                count={auth.user.impressions}
              />
            </div>
            <MyItems />
          </div>
        )}
      </Card>
      {isShowingAllMobile && <Discover />}
      <div
        className="flex text-zinc-500 font-semibold p-1 mt-2 hover:bg-zinc-200 cursor-pointer flex-row justify-center items-center text-sm"
        onClick={() => setShowingAllMobile(!isShowingAllMobile)}
      >
        {isShowingAllMobile ? (
          <>
            Show less <ChevronUp />
          </>
        ) : (
          <>
            Show more <ChevronDown />
          </>
        )}
      </div>
    </>
  );
};

export const Sidebar = () => {
  return (
    <div style={{ gridArea: "sidebar" }}>
      <div className="hidden sm:block">
        <SidebarDesktopLayout />
      </div>
      <div className="block sm:hidden">
        <SidebarMobileLayout />
      </div>
    </div>
  );
};
