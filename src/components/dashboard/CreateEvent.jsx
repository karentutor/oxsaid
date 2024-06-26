"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "../ui/scroll-area";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { TimePickerDemo } from "./DatetimePicker/time-picker-demo";
import useAuth from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosBase } from "@/services/BaseService";
import { toast } from "sonner";

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  title: z.string(),
  date: z.date({
    required_error: "A date of event is required.",
  }),
  maxRegistrants: z.number(),
  description: z.string(),
  eventFormat: z.string(),
  eventLocation: z.string(),
  zoomMeetingInvite: z.string(),
  eventCoverImage: z
    .any()
    .optional()
    .refine(
      (file) =>
        file.length == 1
          ? ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type)
          : true,
      "Invalid file. choose either JPEG or PNG image"
    )
    .refine(
      (file) => (file.length == 1 ? file[0]?.size <= MAX_FILE_SIZE : true),
      "Max file size allowed is 8MB."
    ),
});

export default function CreateEvent() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      date: null,
      maxRegistrants: 0,
      eventFormat: "",
      eventLocation: "",
      zoomMeetingInvite: "",
      eventCoverImage: null,
      description: "",
    },
  });

  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: createEvent, isPending } = useMutation({
    mutationFn: (data) =>
      axiosBase.post(
        "/events",
        { ...data, time: data.date, userId: auth.user._id },
        {
          headers: {
            Authorization: auth.access_token,
            "Content-Type": "multipart/form-data",
          },
        }
      ),
    onSuccess: () => {
      toast.success("Event Created 🎉");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: () => toast.error("Something went wrong"),
    // onSettled: () => form.reset(),
  });

  return (
    <section className="[grid-area:sidebar]">
      <Card className="overflow-hidden">
        <ScrollArea className="h-[calc(100vh-100px)]">
          <CardHeader>
            <CardTitle>Create Event</CardTitle>
            <CardDescription>
              Connecting Innovators and Visionaries
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(createEvent)}
              className="space-y-4"
            >
              <CardContent className="grid gap-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel>title</FormLabel>
                      <FormControl>
                        <Input placeholder="title" {...field} />
                      </FormControl>
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
                                format(field.value, "PPP HH:mm:ss")
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
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  type="number"
                  name="maxRegistrants"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel>Max Registrants</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Max Registrants"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventFormat"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel>type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["inPerson", "remote"]?.map((item) => (
                            <SelectItem value={item} key={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("eventFormat") === "inPerson" && (
                  <FormField
                    control={form.control}
                    name="eventLocation"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {form.watch("eventFormat") === "remote" && (
                  <FormField
                    control={form.control}
                    name="zoomMeetingInvite"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormLabel>Zoom Link</FormLabel>
                        <FormControl>
                          <Input placeholder="Zoom Link" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventCoverImage"
                  // eslint-disable-next-line no-unused-vars
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem className="space-y-0">
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Pick Image"
                          type="file"
                          {...fieldProps}
                          accept="image/*"
                          onChange={(event) =>
                            onChange(
                              event.target.files && event.target.files[0]
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="p-0 bg-background border-t sticky bottom-0">
                <div className="py-2 px-6 w-full">
                  <Button
                    disabled={isPending}
                    className="w-full flex items-center gap-2"
                    type="submit"
                  >
                    {isPending ? (
                      <LoaderCircle className="animate-spin w-5 h-5 text-accent" />
                    ) : null}
                    Submit
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Form>
        </ScrollArea>
      </Card>
    </section>
  );
}
