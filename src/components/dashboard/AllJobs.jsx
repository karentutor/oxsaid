import { Search } from "lucide-react";
import { Input } from "../ui/input";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { ScrollArea } from "../ui/scroll-area";
import { jobs } from "@/data";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

export default function AllJobs() {
  return (
    <section className="[grid-area:main]">
      <h1 className="text-2xl lg:text-3xl font-semibold text-center py-3">
        All Jobs
      </h1>
      <div className="bg-background/95 p-4 backdrop-blur w-full supports-[backdrop-filter]:bg-background/60">
        <form>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted" />
            <Input placeholder="Search" className="pl-8" />
          </div>
        </form>
      </div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="flex flex-col gap-2 p-4 pt-0">
          {jobs.map((item) => (
            <button
              key={item.id}
              className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent/10"
            >
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{item.title}</div>
                  </div>
                  <div
                    className={cn(
                      "ml-auto text-xs text-accent hover:!text-primary"
                    )}
                  >
                    {formatDistanceToNow(new Date(item.date), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <div className="text-xs font-medium">
                  {item.country} | {item.city}
                </div>
              </div>
              <div className="line-clamp-2 text-xs text-muted">
                {item.description.substring(0, 300)}
              </div>
              {item.salary ? (
                <Badge variant="outline">{item.salary}</Badge>
              ) : null}
            </button>
          ))}
        </div>
      </ScrollArea>
    </section>
  );
}
