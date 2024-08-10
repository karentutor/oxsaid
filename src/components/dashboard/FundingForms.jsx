/* eslint-disable react/prop-types */
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
import { OCCUPATION_DATA } from "@/data";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import { axiosBase } from "@/services/BaseService";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

const formSchema = z.object({
  amount: z.string(),
  description: z.string(),
  occupation: z.string(),
  subOccupation: z.string(),
  businessNameId: z.string(),
});

export default function FundingForms({ isGetFunding }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      occupation: "",
      subOccupation: "",
      description: "",
      businessNameId: "",
    },
  });

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

  const { mutate: getFunding, isPending } = useMutation({
    mutationFn: (data) =>
      axiosBase.post(
        "/fundings",
        {
          ...data,
          userId: auth.user._id,
          isSeeking: isGetFunding,
        },
        { headers: { Authorization: auth.access_token } }
      ),
    onSuccess: () => {
      toast.success("Funding Created 🎉");
      queryClient.invalidateQueries({ queryKey: ["fundings"] });
    },
    onError: () => toast.error("Something went wrong"),
    onSettled: () => form.reset(),
  });

  return (
    <section className="[grid-area:sidebar]">
      <Card className="overflow-hidden py-4">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <CardHeader>
            <CardTitle>
              {isGetFunding ? "Get Funding" : "Offer Funding"}
            </CardTitle>
            <CardDescription>
              {isGetFunding
                ? "Fuel Your Dreams with Financial Support"
                : "Invest in Tomorrow’s Success Stories"}
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(getFunding)}
              className="space-y-4"
            >
              <CardContent className="grid gap-3">
                <FormField
                  control={form.control}
                  name="businessNameId"
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
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="Amount" {...field} />
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
