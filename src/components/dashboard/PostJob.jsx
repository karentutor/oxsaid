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
import { geoData } from "@/data/geoData";
import { OCCUPATION_DATA } from "@/data";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosBase } from "@/services/BaseService";
import useAuth from "@/hooks/useAuth";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

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

export default function PostJob() {
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
    defaultValues: {
      jobTitle: "",
      country: "",
      city: "",
      salary: "",
      occupation: "",
      subOccupation: "",
      business: "",
      description: "",
    },
  });

  const { mutate: postJob, isPending: isPosting } = useMutation({
    mutationFn: (data) =>
      axiosBase.post(
        "/jobs",
        { ...data, userId: auth.user._id },
        { headers: { Authorization: auth.access_token } }
      ),
    onSuccess: () => {
      toast.success("Job Created 🎉");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: () => toast.error("Something went wrong"),
    onSettled: () => form.reset(),
  });

  return (
    <section className="[grid-area:sidebar]">
      <Card className="overflow-hidden">
        <ScrollArea className="h-[calc(100vh-100px)]">
          <CardHeader>
            <CardTitle>Post Job</CardTitle>
            <CardDescription>Find Your Perfect Candidate</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(postJob)} className="space-y-4">
              <CardContent className="grid gap-3">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
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
                    <FormItem className="space-y-0">
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
                    <FormItem className="space-y-0">
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
                    <FormItem className="space-y-0">
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
                    <FormItem className="space-y-0">
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
                    <FormItem className="space-y-0">
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
                    <FormItem className="space-y-0">
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
                    <FormItem className="space-y-0">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="p-0 bg-background border-t sticky bottom-0">
                <div className="py-2 px-6 w-full">
                  <Button
                    disabled={isPosting}
                    className="w-full flex items-center gap-2"
                    type="submit"
                  >
                    {isPosting ? (
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
