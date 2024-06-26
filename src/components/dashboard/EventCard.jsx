/* eslint-disable react/prop-types */
import moment from "moment";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

export default function EventCard({ item }) {
  return (
    <Card key={item._id}>
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
          {moment(item.date).calendar()}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex w-full flex-col items-start gap-2">
          <h4 className="font-semibold">{item.title}</h4>
          <p className="text-xs font-semibold text-accent">
            max registerants:{" "}
            <span className="font-medium">{item.maxRegistrants}</span>
          </p>
          <p className="line-clamp-2 text-xs text-muted">
            {item.description.substring(0, 300)}
          </p>
          {item.eventFormat ? (
            <Badge variant="outline">{item.eventFormat}</Badge>
          ) : null}

          {item.eventFormat === "inPerson" ? (
            <p className="text-xs font-semibold">
              location:{" "}
              <span className="font-medium">{item.eventLocation}</span>
            </p>
          ) : (
            <p className="text-xs font-semibold">
              zoom link:{" "}
              <span className="font-medium">{item.zoomMeetingInvite}</span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
