import { Search } from "lucide-react";
import { Input } from "../ui/input";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { ScrollArea } from "../ui/scroll-area";
import { businesses } from "@/data";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

export default function BusinessMain() {
  return (
    <section className="[grid-area:main]">
      <div className="bg-background/95 p-4 backdrop-blur w-full supports-[backdrop-filter]:bg-background/60">
        <form>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-8" />
          </div>
        </form>
      </div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="flex flex-col gap-2 p-4 pt-0">
          {businesses.map((item) => (
            <button
              key={item.id}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent"
              )}
            >
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{item.name}</div>
                    {!item.less_than && (
                      <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <div className={cn("ml-auto text-xs text-muted-foreground")}>
                    {formatDistanceToNow(new Date(item.date), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <div className="text-xs font-medium">{item.size}</div>
              </div>
              <div className="line-clamp-2 text-xs text-muted-foreground">
                {item.description.substring(0, 300)}
              </div>
              {item.labels.length ? (
                <div className="flex items-center gap-2">
                  {item.labels.map((label) => (
                    <Badge key={label} variant="outline">
                      {label}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </button>
          ))}
        </div>
      </ScrollArea>
    </section>
  );
}
