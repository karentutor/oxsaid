import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const MyProfileHeader = () => {
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
        <img
          className="w-16 h-16 rounded-full overflow-hidden border-white border-2 mt-[-32px] z-1"
          src="https://images.pexels.com/photos/1546912/pexels-photo-1546912.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        />
      </div>
    </div>
  );
};

const MyProfileProfession = () => {
  return (
    <a
      className="flex justify-center items-center flex-col mt-4 pb-4 border-b"
      href="https://www.linkedin.com/in/ozgurgul35/"
      target="_blank"
    >
      <div className="text-md font-medium hover:underline cursor-pointer">
        Yousef Omar
      </div>
      <div className="text-xs text-zinc-500 mt-1">Frontend Developer</div>
    </a>
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

const MyItems = () => {
  return (
    <div className="flex flex-col gap-3 text-xs font-semibold p-3 text-zinc-500">
      <h5 className="">Invite SBS Alums</h5>
      <div className="flex w-full max-w-sm text-sm items-center space-x-2">
        <Input
          type="email"
          placeholder="Email"
          className="h-8 placeholder:text-xs placeholder:font-light"
        />
        <Button type="submit" size="sm" className="h-8 text-xs">
          send
        </Button>
      </div>
      <div className="flex w-full max-w-sm text-sm items-center space-x-2">
        <Input
          type="email"
          placeholder="Email"
          className="h-8 placeholder:text-xs placeholder:font-light"
        />
        <Button type="submit" size="sm" className="h-8 text-xs">
          send
        </Button>
      </div>
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
  return (
    <>
      <Card className="overflow-hidden">
        <MyProfileHeader />
        <MyProfileProfession />
        <div>
          <div className="py-3 border-b">
            <MyProfileStats text="Who's viewed your profile" count={50} />
            <MyProfileStats text="Impressions of your post" count={9195} />
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
  return (
    <>
      <Card className="overflow-hidden">
        <MyProfileHeader />
        <MyProfileProfession />
        {isShowingAllMobile && (
          <div>
            <div className="py-3 border-b">
              <MyProfileStats text="Who's viewed your profile" count={50} />
              <MyProfileStats text="Impressions of your post" count={9195} />
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
