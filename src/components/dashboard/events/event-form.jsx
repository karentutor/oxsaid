/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosBase } from "@/services/BaseService";
import useAuth from "@/hooks/useAuth";
import { CalendarIcon, LoaderCircle, X } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { defaultEvent } from "@/pages/events";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { TimePickerDemo } from "../DatetimePicker/time-picker-demo";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z
  .object({
    title: z.string().nonempty("Title is required."),
    date: z.date().refine((date) => date > new Date(), {
      message: "Event date must not be today or in the past.",
    }),
    maxRegistrants: z
      .number()
      .positive("Max Registrants must be a positive number.")
      .min(1, "Max Registrants must be at least 1."),
    description: z.string().nonempty("Description is required."),
    eventFormat: z.string().nonempty("Event format is required."),
    eventLocation: z.string().optional(),
    zoomMeetingInvite: z.string().optional(),
    groupId: z.string(),
    eventCoverImage: z
      .union([
        z
          .instanceof(File)
          .refine(
            (file) =>
              file &&
              ACCEPTED_IMAGE_TYPES.includes(file.type) &&
              file.size <= MAX_FILE_SIZE,
            "Invalid file. Choose either JPEG, JPG, PNG, or WEBP image. Max file size allowed is 5MB."
          ),
        z.string().nonempty({ message: "Image is required." }),
      ])
      .optional(),
  })
  .refine(
    (data) => {
      if (data.eventFormat === "inPerson" && !data.eventLocation) {
        return false;
      }
      if (data.eventFormat === "remote" && !data.zoomMeetingInvite) {
        return false;
      }
      return true;
    },
    {
      message:
        "Event location or Zoom meeting invite is required based on the event format.",
      path: ["eventLocation", "zoomMeetingInvite"],
    }
  );

export default function EventForm({
  trigger,
  selectedEvent,
  setSelectedEvent,
  type = "add",
}) {
  const [open, setOpen] = useState(false);
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const { data: groups } = useQuery({
    queryKey: ["groups"],
    queryFn: () =>
      axiosBase.get("/groups", {
        headers: { Authorization: auth.access_token },
      }),
    select: (data) =>
      data.data.groups.map((item) => ({
        label: item.name,
        value: item._id,
      })),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...selectedEvent,
      groupId: selectedEvent?.groupId?._id,
      date: new Date(selectedEvent.date),
    },
  });

  const eventFormat = useWatch({
    control: form.control,
    name: "eventFormat",
  });

  const config = {
    headers: {
      Authorization: auth.access_token,
      "Content-Type": "multipart/form-data",
    },
  };

  const { mutate: postEvent, isPending: isPosting } = useMutation({
    mutationFn: (data) => {
      let eventCoverImage;

      if (type === "add") {
        if (data.eventCoverImage instanceof File) {
          eventCoverImage = data.eventCoverImage;
        } else {
          throw new Error("Image file is required for creating a new event");
        }
      } else {
        if (data.eventCoverImage instanceof File) {
          eventCoverImage = data.eventCoverImage;
        } else {
          eventCoverImage = selectedEvent.eventCoverImage;
        }
      }

      const payload = {
        ...data,
        userId: auth.user._id,
        time: data.date,
        eventCoverImage,
      };

      if (type === "add") {
        return axiosBase.post("/events", payload, config);
      } else {
        return axiosBase.put(`/events/${selectedEvent?._id}`, payload, config);
      }
    },
    onSuccess: () => {
      toast.success(type === "add" ? "Event Created 🎉" : "Event Updated 🎉");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: () => toast.error("Something went wrong"),
    onSettled: () => {
      form.reset();
      setSelectedEvent(defaultEvent);
      setOpen(false);
    },
  });

  useEffect(() => {
    form.reset({
      ...selectedEvent,
      groupId: selectedEvent?.groupId?._id,
      date: new Date(selectedEvent.date),
    });
  }, [selectedEvent]);

  const handleFormatChange = (value) => {
    form.setValue("eventFormat", value);
    form.trigger("eventLocation");
    form.trigger("zoomMeetingInvite");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (val === false) {
          setSelectedEvent(defaultEvent);
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{type === "add" ? "Add" : "Edit"} a Event</DialogTitle>
        </DialogHeader>
        {/* Form Content */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(postEvent)}>
            <ScrollArea className="h-[450px] !flex flex-col gap-4 pe-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.title?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="groupId"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>Group</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {groups?.map((item) => (
                          <SelectItem value={item.value} key={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-left">
                      Event Date & Time
                    </FormLabel>
                    <Popover>
                      <FormControl>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal",
                              !field.value && "text-muted"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP HH:mm")
                            ) : (
                              <span>Pick a date & time</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                      </FormControl>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                        <div className="p-3 border-t border-border">
                          <TimePickerDemo
                            setDate={field.onChange}
                            date={field.value}
                            showSeconds={false}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage>
                      {form.formState.errors.date?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxRegistrants"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>Max Registrants</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Max Registrants"
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (value > 0) {
                            field.onChange(value);
                          } else {
                            field.onChange(""); // Set to empty string if invalid to clear the input
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.maxRegistrants?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventFormat"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={handleFormatChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["inPerson", "remote"].map((item) => (
                          <SelectItem type="button" value={item} key={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage>
                      {form.formState.errors.eventFormat?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {eventFormat === "inPerson" && (
                <FormField
                  control={form.control}
                  name="eventLocation"
                  render={({ field }) => (
                    <FormItem className="space-y-0 pb-2 px-1">
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Location" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              {eventFormat === "remote" && (
                <FormField
                  control={form.control}
                  name="zoomMeetingInvite"
                  render={({ field }) => (
                    <FormItem className="space-y-0 pb-2 px-1">
                      <FormLabel>Zoom Link</FormLabel>
                      <FormControl>
                        <Input placeholder="Zoom Link" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.description?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventCoverImage"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Click for Image"
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file =
                            event.target.files && event.target.files[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.eventCoverImage?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </ScrollArea>
            <DialogFooter className="px-3 pt-3">
              <DialogClose asChild>
                <Button variant="outline" type="submit">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPosting}
                className="w-fit flex items-center gap-2"
              >
                {isPosting ? (
                  <LoaderCircle className="animate-spin w-5 h-5 text-accent" />
                ) : null}
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
