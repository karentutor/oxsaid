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
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import { OCCUPATION_DATA, VISIBILITY_DATA, companysizeData } from "@/data";
import useAuth from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosBase } from "@/services/BaseService";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

const formSchema = z.object({
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string().email(),
  websiteUrl: z.string(),
  description: z.string(),
  occupation: z.string(),
  subOccupation: z.string(),
  size: z.number(),
  visibility: z.string(),
  isAlumniOwned: z.boolean(),
  isLessThanTwoYears: z.boolean(),
  yearFounded: z.number(),
});

export default function BusinessForm() {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      occupation: "",
      subOccupation: "",
      address: "",
      description: "",
      websiteUrl: "",
      visibility: "",
      isAlumniOwned: false,
      isLessThanTwoYears: false,
    },
  });
  const { mutate: createBusiness, isPending: isCreating } = useMutation({
    mutationFn: (data) =>
      axiosBase.post(
        "/businesses",
        { ...data, userId: auth.user._id },
        { headers: { Authorization: auth.access_token } }
      ),
    onSuccess: () => {
      toast.success("Business Created 🎉");
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
    onError: () => toast.error("Something went wrong"),
    onSettled: () => form.reset(),
  });

  return (
    <section className="[grid-area:sidebar]">
      <Card className="overflow-hidden">
        <ScrollArea className="h-[calc(100vh-100px)]">
          <CardHeader>
            <CardTitle>Add Business</CardTitle>
            <CardDescription>Elevate Your Business with Us</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(createBusiness)}
              className="space-y-4"
            >
              <CardContent className="grid gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Business Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel>Business Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Business Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel>Business Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Business Phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel>Business Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Business Email" {...field} />
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
                      <FormLabel>Business Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Business Description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="websiteUrl"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel>Business Url</FormLabel>
                      <FormControl>
                        <Input placeholder="Business Url" {...field} />
                      </FormControl>
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
                  name="size"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel>Business Size</FormLabel>
                      <Select
                        onValueChange={(val) => field.onChange(+val)}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {companysizeData.map((item, index) => (
                            <SelectItem value={`${index}`} key={item.id}>
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
                  name="visibility"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel>Business Visibility</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Visibility" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {VISIBILITY_DATA.map((item) => (
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
                  name="isAlumniOwned"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>More than 50% alumni owned</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isLessThanTwoYears"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Less than 2 years old?</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                {form.watch("isLessThanTwoYears") ? (
                  <FormField
                    control={form.control}
                    name="yearFounded"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormLabel>Year Founded</FormLabel>
                        <Select
                          onValueChange={(v) => field.onChange(+v)}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Year founded" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from(
                              { length: 4 },
                              (_, i) => `${new Date().getFullYear() - i}`
                            ).map((item) => (
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
                ) : null}
              </CardContent>
              <CardFooter className="p-0 bg-background border-t sticky bottom-0">
                <div className="py-2 px-6 w-full">
                  <Button
                    disabled={isCreating}
                    className="w-full flex items-center gap-2"
                    type="submit"
                  >
                    {isCreating ? (
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
