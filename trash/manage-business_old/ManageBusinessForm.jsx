import React from 'react'

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OCCUPATION_DATA, VISIBILITY_DATA, companysizeData } from "@/data";
import { LoaderCircle } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Business Name is required."),
  address: z.string().min(1, "Business Address is required."),
  phone: z.string().min(1, "Business Phone is required."),
  email: z.string().email("Invalid email format."),
  websiteUrl: z.string().min(1, "Website URL is required."),
  description: z.string().min(1, "Business Description is required."),
  occupation: z.string().min(1, "Occupation is required."),
  subOccupation: z.string().min(1, "Sub-occupation is required."),
  size: z.number().positive("Size must be a positive number."),
  visibility: z.string().min(1, "Visibility is required."),
  isAlumniOwned: z.boolean(),
  isLessThanTwoYears: z.boolean(),
  yearFounded: z.number().optional().refine(val => !val || val <= new Date().getFullYear(), {
    message: "Year Founded must not be in the future.",
  }),
  picture: z.instanceof(File).optional()
});

const SAMPLE_DATA = {
  name: "Sample Business",
  address: "123 Sample Street",
  phone: "123-456-7890",
  email: "sample@business.com",
  websiteUrl: "https://www.samplebusiness.com",
  description: "This is a sample business description.",
  occupation: "Retail",
  subOccupation: "Clothing",
  size: 10,
  visibility: "Public",
  isAlumniOwned: true,
  isLessThanTwoYears: false,
  yearFounded: 2020
};

export default function ManageBusinessForm({ form, handleFileChange, createBusiness, isCreating, preview, formState }) {
  return (
    <section className="w-full h-full flex justify-center items-center">
      <Card className="overflow-hidden w-full h-full">
        <ScrollArea className="h-full">
          <CardHeader>
            <CardTitle>Edit Business</CardTitle>
            <CardDescription>Update Your Business Information</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form
              onSubmit={createBusiness}
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
                        <Input placeholder="Business Name" {...field} defaultValue={SAMPLE_DATA.name} />
                      </FormControl>
                      <FormMessage>{formState.errors.name?.message}</FormMessage>
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
                        <Input placeholder="Business Address" {...field} defaultValue={SAMPLE_DATA.address} />
                      </FormControl>
                      <FormMessage>{formState.errors.address?.message}</FormMessage>
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
                        <Input placeholder="Business Phone" {...field} defaultValue={SAMPLE_DATA.phone} />
                      </FormControl>
                      <FormMessage>{formState.errors.phone?.message}</FormMessage>
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
                        <Input placeholder="Business Email" {...field} defaultValue={SAMPLE_DATA.email} />
                      </FormControl>
                      <FormMessage>{formState.errors.email?.message}</FormMessage>
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
                          defaultValue={SAMPLE_DATA.description}
                        />
                      </FormControl>
                      <FormMessage>{formState.errors.description?.message}</FormMessage>
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
                        <Input placeholder="Business Url" {...field} defaultValue={SAMPLE_DATA.websiteUrl} />
                      </FormControl>
                      <FormMessage>{formState.errors.websiteUrl?.message}</FormMessage>
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
                        defaultValue={SAMPLE_DATA.occupation}
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
                      <FormMessage>{formState.errors.occupation?.message}</FormMessage>
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
                        defaultValue={SAMPLE_DATA.subOccupation}
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
                      <FormMessage>{formState.errors.subOccupation?.message}</FormMessage>
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
                        defaultValue={SAMPLE_DATA.size}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Size">
                              {SAMPLE_DATA.size
                                ? companysizeData.find(
                                    (item) => item.id === SAMPLE_DATA.size
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
                        {formState.errors.size?.message}
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
                        defaultValue={SAMPLE_DATA.visibility}
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
                        {formState.errors.visibility?.message}
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
                          checked={SAMPLE_DATA.isAlumniOwned}
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
                  name="yearFounded"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel>Year Founded</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(Number(v))}
                        defaultValue={SAMPLE_DATA.yearFounded}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Year founded">
                              {SAMPLE_DATA.yearFounded
                                ? SAMPLE_DATA.yearFounded.toString()
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
                        {formState.errors.yearFounded?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  name="picture"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel>Business Picture</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            handleFileChange(e.target.files?.[0]);
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
                      <FormMessage>{formState.errors.picture?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="p-0 bg-background border-t sticky bottom-0">
                <div className="py-2 px-6 w-full">
                  <Button
                    disabled={!formState.isValid || isCreating}
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
