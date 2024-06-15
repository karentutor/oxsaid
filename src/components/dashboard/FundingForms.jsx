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
import { toast } from "../ui/use-toast";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { geoData } from "@/data/geoData";
import { OCCUPATION_DATA } from "@/data";

const formSchema = z.object({
  amount: z.string(),
  description: z.string(),
  occupation: z.string(),
  subOccupation: z.string(),
  bussiness: z.string(),
});

export default function FundingForms() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      occupation: "",
      subOccupation: "",
      business: "",
      description: "",
    },
  });

  function onSubmit(values) {
    // Do something with the form values.
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });
    console.log(values);
  }

  return (
    <section className="[grid-area:sidebar]">
      <Tabs defaultValue="get" className="">
        <TabsList className="grid w-full grid-cols-2 bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-gray-200">
          <TabsTrigger value="get">Get Funding</TabsTrigger>
          <TabsTrigger value="offer">Offer Funding</TabsTrigger>
        </TabsList>
        <TabsContent value="get">
          <Card className="overflow-hidden py-4">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <CardHeader>
                <CardTitle>Get Funding</CardTitle>
                <CardDescription>
                  Fuel Your Dreams with Financial Support
                </CardDescription>
              </CardHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <CardContent className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="business"
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormLabel>business</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!form.watch("country")}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Business" />
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
                      <Button className="w-full" type="submit">
                        Submit
                      </Button>
                    </div>
                  </CardFooter>
                </form>
              </Form>
            </ScrollArea>
          </Card>
        </TabsContent>
        <TabsContent value="offer">
          <Card className="overflow-hidden py-4">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <CardHeader>
                <CardTitle>Offer Funding</CardTitle>
                <CardDescription>
                  Invest in Tomorrow’s Success Stories
                </CardDescription>
              </CardHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <CardContent className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="business"
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormLabel>business</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!form.watch("country")}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Business" />
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
                      <Button className="w-full" type="submit">
                        Submit
                      </Button>
                    </div>
                  </CardFooter>
                </form>
              </Form>
            </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
