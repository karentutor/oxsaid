import { Search } from "lucide-react";
import { Input } from "../ui/input";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { ScrollArea } from "../ui/scroll-area";
import { events } from "@/data";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";

export default function AllEvents() {
  return (
    <section className="[grid-area:main]">
      <h1 className="text-2xl lg:text-3xl font-semibold text-center py-3">
        All Events
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 pt-0">
          {events.map((item) => (
            <Card key={item.id}>
              <CardHeader className="relative p-2">
                <img
                  src="/imgs/about.jpg"
                  alt={item.title}
                  className="rounded-lg object-cover"
                />
                <div
                  className={cn(
                    "ml-auto text-xs text-accent hover:!text-primary absolute top-2 right-4 bg-background py-0.5 px-2 rounded-2xl"
                  )}
                >
                  {formatDistanceToNow(new Date(item.date), {
                    addSuffix: true,
                  })}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex w-full flex-col items-start gap-2">
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-xs font-medium text-accent">{item.type}</p>
                  <p className="line-clamp-2 text-xs text-muted">
                    {item.description.substring(0, 300)}
                  </p>
                  {item.location ? (
                    <Badge variant="outline">{item.location}</Badge>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </section>
  );
}
