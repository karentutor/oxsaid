"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
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
import { useState } from "react";

const formSchema = z.object({
  name: z.string().nonempty("Business Name is required."),
  address: z.string().nonempty("Business Address is required."),
  phone: z.string().nonempty("Business Phone is required."),
  email: z.string().email("Invalid email format."),
  websiteUrl: z.string().nonempty("Website URL is required."),
  description: z.string().nonempty("Business Description is required."),
  occupation: z.string().nonempty("Occupation is required."),
  subOccupation: z.string().nonempty("Sub-occupation is required."),
  size: z.number().positive("Size must be a positive number."),
  visibility: z.string().nonempty("Visibility is required."),
  isAlumniOwned: z.boolean(),
  isLessThanTwoYears: z.boolean(),
  yearFounded: z.number().optional().refine(val => !val || val <= new Date().getFullYear(), {
    message: "Year Founded must not be in the future.",
  }),
  picture: z.instanceof(File).optional()
});

export default function BusinessForm() {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState(null);
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "Test Business",
      email: "test@example.com",
      phone: "123-456-7890",
      occupation: "Technology",
      subOccupation: "Software Development",
      address: "123 Test St",
      description: "This is a test business.",
      websiteUrl: "https://www.testbusiness.com",
      size: 1,
      visibility: "Public",
      isAlumniOwned: true,
      isLessThanTwoYears: false,
      yearFounded: 2020,
      picture: null
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    form.setValue("picture", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const { mutate: createBusiness, isPending: isCreating } = useMutation({
    mutationFn: (data) => {
      const formData = new FormData();
      for (const key in data) {
        if (data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      }
      if (data.picture) {
        formData.append("picture", data.picture);
        formData.append("picturePath", data.picture.name || "");
      }
      formData.append('userId', auth.user._id);

      return axiosBase.post(
        "businesses",
        formData,
        { headers: { Authorization: auth.access_token, "Content-Type": "multipart/form-data" } }
      );
    },
    onSuccess: () => {
      toast.success("Business Created 🎉");
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Something went wrong");
    },
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
                      <FormMessage>{form.formState.errors.name?.message}</FormMessage>
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
                      <FormMessage>{form.formState.errors.address?.message}</FormMessage>
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
                      <FormMessage>{form.formState.errors.phone?.message}</FormMessage>
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
                      <FormMessage>{form.formState.errors.email?.message}</FormMessage>
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
                      <FormMessage>{form.formState.errors.description?.message}</FormMessage>
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
                      <FormMessage>{form.formState.errors.websiteUrl?.message}</FormMessage>
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
                      <FormMessage>{form.formState.errors.occupation?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subOccupation"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel>Sub-occupation</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!form.watch("occupation")}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Sub-occupation" />
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
                      <FormMessage>{form.formState.errors.subOccupation?.message}</FormMessage>
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
                        onValueChange={(val) => field.onChange(Number(val))}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Size">
                              {field.value
                                ? companysizeData.find(
                                    (item) => item.id === field.value
                                  )?.name
                                : "Select Size"}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {companysizeData.map((item) => (
                            <SelectItem value={item.id} key={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage>
                        {form.formState.errors.size?.message}
                      </FormMessage>
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
                      <FormMessage>
                        {form.formState.errors.visibility?.message}
                      </FormMessage>
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
                <FormField
                  control={form.control}
                  name="yearFounded"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel>Year Founded</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(Number(v))}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Year founded">
                              {field.value
                                ? field.value.toString()
                                : "Select Year founded"}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-40 overflow-y-auto">
                          {Array.from(
                            { length: 200 },
                            (_, i) => `${new Date().getFullYear() - i}`
                          ).map((item) => (
                            <SelectItem value={item} key={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage>
                        {form.formState.errors.yearFounded?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="picture"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel>Business Picture</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) => {
                            handleFileChange(e);
                            field.onChange(e.target.files?.[0]);
                          }}
                        />
                      </FormControl>
                      {preview && (
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded mt-2"
                        />
                      )}
                      <FormMessage>{form.formState.errors.picture?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="p-0 bg-background border-t sticky bottom-0">
                <div className="py-2 px-6 w-full">
                  <Button
                    disabled={!form.formState.isValid || isCreating}
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
