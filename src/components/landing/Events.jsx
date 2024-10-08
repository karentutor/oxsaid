import { useEffect, useState } from "react";
import { axiosBase } from "@/services/BaseService";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import moment from "moment";
import { MdLocationOn, MdOutlineAccessTime } from "react-icons/md";

export const Events = () => {

  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    try {
      const response = await axiosBase.get("events/get-public-events");
      if (response.data.isSuccess) {
        console.log("Fetched Events:", response.data.events); 
        setEvents(response.data.events);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto w-full relative" id="events">
      <div className="mx-auto mb-4 max-w-screen-sm w-full text-center">
        <p className="text-accent text-sm font-bold">Events</p>
        <h2 className="mt-1 text-3xl font-bold">Upcoming Events & Activities</h2>
        <p className="mt-2 text-lg">
          Join Us for Monthly Gatherings, Workshops, and Networking Sessions,
          Both Virtually and In-Person
        </p>
      </div>
      <Carousel className="max-w-7xl mx-auto w-full md:px-16">
        <CarouselContent className="py-4">
          {events.map((event, index) => (
            <CarouselItem
              key={event._id || index}  // Use `event.id` if unique, otherwise fallback to index
              className="basis-full lg:basis-1/2 xl:basis-1/3"
            >
              <div className="flex flex-col gap-4 transition min-h-80 p-4 rounded-xl border hover:shadow-[0_2px_8px_2px_rgba(14,85,124,.16)]">
                <div className="relative">
                  <img
                    className="rounded-lg object-cover w-full h-48"
                    alt={event.title}
                    src={event.eventCoverImage ? event.eventCoverImage : "/imgs/default-event.jpg"}  // Use default image if eventCoverImage is not available
                  />
                  <h4 className="absolute top-4 left-4 w-fit py-1 px-2 rounded-full bg-accent text-white">
                    {event.eventFormat}
                  </h4>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                  <p className="text-muted text-sm">{event.description}</p>
                  <div className="flex items-center gap-2">
                    <MdOutlineAccessTime size={18} className="text-accent" />
                    {moment(event.date).format("dddd, MMMM Do YYYY")}
                  </div>
                  <div className="flex items-center gap-2">
                    <MdLocationOn size={18} className="text-accent" />
                    {event.eventLocation}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="static lg:absolute lg:left-0" />
        <CarouselNext className="static lg:absolute ml-3 lg:ml-0 mt-4 lg:mt-0 lg:right-0" />
      </Carousel>
    </div>
  );
};

export default Events;
