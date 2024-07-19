import { Link, NavLink } from "react-router-dom";
import { CircleUser, Menu } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button, buttonVariants } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { dashboardNavLinks } from "@/data";
import ModeToggle from "../ModeToggle";
import useAuth from "@/hooks/useAuth";
import useLogout from "@/hooks/useLogout";
import { UserAvatar } from "./UserAvatar";

export default function Header() {
  const { auth } = useAuth();
  const logout = useLogout();
  return (
    <header className="sticky z-10 top-0 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 lg:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium max-w-[1600px] mx-auto lg:flex lg:flex-row lg:justify-between lg:w-full lg:items-center md:gap-5 lg:text-sm lg:gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold lg:text-2xl text-accent"
        >
          <img
            src="/imgs/logo-large-light.png"
            alt="logo light"
            className="w-36 hidden lg:block lg:dark:hidden"
          />
          <img
            src="/imgs/logo-large-dark.png"
            alt="logo light"
            className="w-36 hidden lg:hidden lg:dark:block"
          />
          <img
            src="/imgs/logo-small-dark.png"
            alt="logo light"
            className="w-16 lg:hidden lg:dark:hidden dark:block hidden"
          />
          <img
            src="/imgs/logo-small-light.png"
            alt="logo light"
            className="w-16 lg:dark:hidden lg:hidden dark:hidden"
          />
          <span className="sr-only">Oxsaid</span>
        </Link>
        <div>
          {dashboardNavLinks.map(({ href, label, icon: Icon }) => (
            <NavLink
              key={label}
              to={href}
              className={({ isActive }) =>
                `flex items-center gap-1.5 ${
                  isActive ? "!text-accent" : "!text-foreground"
                } ${buttonVariants({
                  variant: "link",
                })}`
              }
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                {auth.user.picturePath ? (
                  <UserAvatar
                    imageUrl={auth.user.picturePath}
                    className="border"
                  />
                ) : (
                  <>
                    <CircleUser className="h-5 w-5" />
                    <span className="sr-only">Toggle user menu</span>
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-44" align="end">
              <DropdownMenuLabel className="flex flex-col gap-1.5">
                <p className="font-medium">
                  {auth?.user?.firstName} {auth?.user?.lastName}
                </p>
                <span className="text-gray-500 text-xs">{auth.user.email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200" />
              <Link to={`/profile/${auth.user._id}`}>
                <DropdownMenuItem>Contributions & Settings</DropdownMenuItem>
              </Link>
              <DropdownMenuItem>
                <Link to="/contact">Contact Us</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link to="/" className="text-2xl text-accent font-semibold mb-6">
              OXSAID
              <span className="sr-only">Oxsaid</span>
            </Link>
            <div className="flex flex-col gap-6 font-medium text-lg">
              {dashboardNavLinks.map(({ href, label, icon: Icon }) => (
                <NavLink
                  key={label}
                  to={href}
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${
                      isActive ? "text-accent" : "text-foreground"
                    }`
                  }
                >
                  <Icon size={20} />
                  {label}
                </NavLink>
              ))}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex lg:hidden items-center gap-3">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-44" align="end">
            <DropdownMenuLabel className="flex flex-col gap-1.5">
              <p className="font-medium">Yousef Omar</p>
              <span className="text-gray-500 text-xs">@Yousefomar724</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem>
              <Link to="/profile">Account</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/contact">Contact Us</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
