import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "../ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

import { buttonVariants } from "../ui/button";
import { Menu } from "lucide-react";
import ModeToggle from "../ModeToggle";
import { navLinks } from "@/data";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

  const changeBg = () => setIsHeaderScrolled(window.scrollY > 50);

  // Change Background onscroll
  useEffect(() => {
    window.addEventListener("scroll", changeBg);
    return () => window.removeEventListener("scroll", changeBg);
  }, []);

  return (
    <header
      className={`fixed top-0 z-40 w-full ${
        isHeaderScrolled
          ? "bg-background shadow-[0_2px_12px_-10px_rgba(0,0,0,0.3)] border-b"
          : "bg-transparent"
      }`}
    >
      <NavigationMenu className="mx-auto py-2 overflow-hidden">
        <NavigationMenuList className="container h-14 w-screen flex justify-between">
          <NavigationMenuItem className="font-bold flex">
            <a href="#" className="font-bold text-2xl lg:text-3xl text-accent">
              OXSAID
            </a>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden">
            <ModeToggle />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5"
                  onClick={() => setIsOpen(true)}
                >
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>

              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">OXSAID</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-4">
                  {navLinks.map(({ href, label }) => (
                    <NavLink
                      key={label}
                      to={href}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        isActive ? "text-primary" : "text-foreground"
                      }
                    >
                      {label}
                    </NavLink>
                  ))}
                  <Link
                    to="/signin"
                    className={buttonVariants({
                      variant: "outline",
                    })}
                  >
                    Sign In
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className="hidden md:flex gap-2">
            {navLinks.map((route, i) => (
              <a
                href={route.href}
                key={i}
                className={`${buttonVariants({
                  variant: "link",
                })} hover:text-accent`}
              >
                {route.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex gap-2">
            <ModeToggle />
            <Link
              to="/signin"
              className={buttonVariants({ variant: "outline" })}
            >
              Sign In
            </Link>

            {/* <ModeToggle /> */}
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
