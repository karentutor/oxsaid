/* eslint-disable react/prop-types */
import moment from "moment";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import EventForm from "./events/event-form";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import { ConfirmDelete } from "./FeedItem";
import { useState } from "react";
import { defaultEvent } from "@/pages/events";

export default function EventCard({ item, onDelete, isMyEvent = false }) {
  const [selectedEvent, setSelectedEvent] = useState(defaultEvent);
  return (
    <Card key={item._id}>
      <CardHeader className="relative p-2">
        <img
          src={item.eventCoverImage ? item.eventCoverImage : "/imgs/about.jpg"}
          alt={item.title}
          className="rounded-lg object-cover w-full h-48"
        />
        <div
          className={cn(
            "ml-auto text-sm text-accent hover:!text-primary absolute top-2 right-4 bg-background py-0.5 px-2 rounded-2xl"
          )}
        >
          {moment(item.date).calendar()}
        </div>
      </CardHeader>
      <CardContent className="p-4 text-center">
        <div className="flex w-full flex-col items-center gap-2">
          <h4 className="font-semibold text-2xl">{item.title}</h4>
          <p className="text-lg font-semibold text-accent">
            max registrants:{" "}
            <span className="font-medium">{item.maxRegistrants}</span>
          </p>
          <p className="line-clamp-2 text-base text-muted">
            {item.description.substring(0, 300)}
          </p>
          {item.eventFormat ? (
            <Badge
              variant="outline"
              className="bg-accent text-white py-1 px-2 rounded-full"
            >
              {item.eventFormat}
            </Badge>
          ) : null}

          {item.eventFormat === "inPerson" ? (
            <p className="text-lg font-semibold">
              location:{" "}
              <span className="font-medium">{item.eventLocation}</span>
            </p>
          ) : (
            <p className="text-lg font-semibold">
              zoom link:{" "}
              <span className="font-medium">{item.zoomMeetingInvite}</span>
            </p>
          )}
          {isMyEvent ? (
            <div className="flex items-center">
              <EventForm
                type="edit"
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
                trigger={
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    type="button"
                    onClick={() => setSelectedEvent(item)}
                  >
                    <Edit size={14} /> Edit
                  </Button>
                }
              />
              <ConfirmDelete onDelete={onDelete} />
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
