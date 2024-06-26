import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { sidebarNavItems } from "@/data";
import { cn } from "@/lib/utils";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function ProfileLayout() {
  const { pathname } = useLocation();
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/5 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Profile</h1>
        <p className="text-muted">Manage your account and set preferences.</p>
        <Separator />
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-1 text-sm text-muted">
          <h3 className="font-semibold">Manage Preferences</h3>
          {sidebarNavItems.slice(0, 6).map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === item.href
                  ? "bg-accent text-white"
                  : "hover:bg-accent",
                "justify-start"
              )}
            >
              {item.title}
            </Link>
          ))}
          <h3 className="font-semibold mt-3">Settings</h3>
          {sidebarNavItems.slice(6, sidebarNavItems.length).map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === item.href
                  ? "bg-accent text-white"
                  : "hover:bg-accent",
                "justify-start"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="grid gap-6">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
