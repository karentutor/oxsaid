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
import { useForm } from "react-hook-form";
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
import { geoData } from "@/data/geoData";
import { OCCUPATION_DATA } from "@/data";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosBase } from "@/services/BaseService";
import useAuth from "@/hooks/useAuth";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { defaultJob } from "@/pages/jobs";

const formSchema = z.object({
  jobTitle: z.string(),
  country: z.string(),
  city: z.string(),
  salary: z.string(),
  description: z.string(),
  occupation: z.string(),
  subOccupation: z.string(),
  businessId: z.string(),
});

export default function JobForm({
  trigger,
  selectedJob,
  setSelectedJob,
  type = "add",
}) {
  const [open, setOpen] = useState(false);
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const { data: businesses } = useQuery({
    queryKey: ["businesses"],
    queryFn: () =>
      axiosBase.get("/businesses", {
        headers: { Authorization: auth.access_token },
      }),
    select: (data) =>
      data.data.business.map((item) => ({
        label: item.name.name,
        value: item._id,
      })),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: selectedJob,
  });

  const { mutate: postJob, isPending: isPosting } = useMutation({
    mutationFn: (data) =>
      type === "add"
        ? axiosBase.post(
            "/jobs",
            { ...data, userId: auth.user._id },
            { headers: { Authorization: auth.access_token } }
          )
        : axiosBase.put(
            // eslint-disable-next-line react/prop-types
            `/jobs/${selectedJob?._id}`,
            { ...data, userId: auth.user._id },
            { headers: { Authorization: auth.access_token } }
          ),
    onSuccess: () => {
      if (type === "add") {
        toast.success("Job Created 🎉");
      } else {
        toast.success("Job Updated 🎉");
      }
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: () => toast.error("Something went wrong"),
    onSettled: () => {
      form.reset();
      setSelectedJob(defaultJob);
    },
  });

  useEffect(() => {
    form.reset(selectedJob);
  }, [selectedJob]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{type === "add" ? "Add" : "Edit"} a Job</DialogTitle>
        </DialogHeader>
        {/* Form Content */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(postJob)}>
            <ScrollArea className="h-[450px] !flex flex-col gap-4 pe-2">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>Job title</FormLabel>
                    <FormControl>
                      <Input placeholder="Job title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessId"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>Business</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Business" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {businesses?.map((item) => (
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
                name="country"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>country</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(geoData).map((item) => (
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
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>city</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!form.watch("country")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {geoData[form.watch("country")]?.map((item) => (
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
              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>Occupation</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Occupation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {OCCUPATION_DATA.map((item) => (
                          <SelectItem value={item.name} key={item.name}>
                            {item.name}
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
                name="subOccupation"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>subOccupation</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!form.watch("occupation")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select SubOccupation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {OCCUPATION_DATA.find(
                          (item) => item.name === form.watch("occupation")
                        )?.sublist.map((item) => (
                          <SelectItem value={item.name} key={item.name}>
                            {item.name}
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
                name="salary"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>Job salary</FormLabel>
                    <FormControl>
                      <Input placeholder="Job salary" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
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
