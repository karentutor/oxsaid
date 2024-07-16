import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, Controller } from "react-hook-form";
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

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  title: z.string().nonempty("Title is required."),
  date: z.date().refine(date => date > new Date(), {
    message: "Event date must not be today or in the past.",
  }),
  maxRegistrants: z.number().positive("Max Registrants must be a positive number.").min(1, "Max Registrants must be at least 1."),
  description: z.string().nonempty("Description is required."),
  eventFormat: z.string().nonempty("Event format is required."),
  eventLocation: z.string().optional(),
  zoomMeetingInvite: z.string().optional(),
  eventCoverImage: z
    .any()
    .optional()
    .refine(
      (file) =>
        !file || (file && ACCEPTED_IMAGE_TYPES.includes(file?.type) && file?.size <= MAX_FILE_SIZE),
      "Invalid file. Choose either JPEG or PNG image. Max file size allowed is 2MB."
    ),
}).refine(data => {
  if (data.eventFormat === "inPerson" && !data.eventLocation) {
    return false;
  }
  if (data.eventFormat === "remote" && !data.zoomMeetingInvite) {
    return false;
  }
  return true;
}, {
  message: "Event location or Zoom meeting invite is required based on the event format.",
  path: ["eventLocation", "zoomMeetingInvite"], 
});

const CreateEvent = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      date: null,
      maxRegistrants: 1,
      eventFormat: "",
      eventLocation: "",
      zoomMeetingInvite: "",
      eventCoverImage: null,
      description: "",
    },
  });

  const { control, setValue, trigger } = form;
  const eventFormat = useWatch({
    control: form.control,
    name: "eventFormat",
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
  });

  const handleFormatChange = (value) => {
    setValue("eventFormat", value);
    trigger("eventLocation");
    trigger("zoomMeetingInvite");
  };

  return (
    <section className="grid-area:sidebar">
      <Card className="overflow-hidden">
        <ScrollArea className="h-[calc(100vh-100px)]">
          <CardHeader>
            <CardTitle>Create Event</CardTitle>
            <CardDescription>
              Connecting Innovators and Visionaries
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(createEvent)} className="space-y-4">
              <CardContent className="grid gap-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Title" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.title?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-left">Event Date & Time</FormLabel>
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
                              {field.value ? format(field.value, "PPP HH:mm") : <span>Pick a date & time</span>}
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
                      <FormMessage>{form.formState.errors.date?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxRegistrants"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
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
                      <FormMessage>{form.formState.errors.maxRegistrants?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventFormat"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
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
                            <SelectItem value={item} key={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage>{form.formState.errors.eventFormat?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                {eventFormat === "inPerson" && (
                  <FormField
                    control={form.control}
                    name="eventLocation"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Location" {...field} />
                        </FormControl>
                        <FormMessage>{form.formState.errors.eventLocation?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                )}
                {eventFormat === "remote" && (
                  <FormField
                    control={form.control}
                    name="zoomMeetingInvite"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormLabel>Zoom Link</FormLabel>
                        <FormControl>
                          <Input placeholder="Zoom Link" {...field} />
                        </FormControl>
                        <FormMessage>{form.formState.errors.zoomMeetingInvite?.message}</FormMessage>
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
                      <FormMessage>{form.formState.errors.description?.message}</FormMessage>
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
                      <FormMessage>{form.formState.errors.eventCoverImage?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="p-0 bg-background border-t sticky bottom-0">
                <div className="py-2 px-6 w-full">
                  <Button
                    disabled={!form.formState.isValid || isPending}
                    className="w-full flex items-center gap-2"
                    type="submit"
                  >
                    {isPending ? <LoaderCircle className="animate-spin h-5 w-5" /> : "Create Event"}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Form>
        </ScrollArea>
      </Card>
    </section>
  );
};

export default CreateEvent;
