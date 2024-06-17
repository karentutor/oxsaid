"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { X } from "lucide-react";
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
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { useCallback, useRef, useState } from "react";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  title: z.string(),
  members: z.array(),
  maxRegistrants: z.number(),
  img: z
    .any()
    .optional()
    .refine(
      (file) =>
        file.length == 1
          ? ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type)
            ? true
            : false
          : true,
      "Invalid file. choose either JPEG or PNG image"
    )
    .refine(
      (file) =>
        file.length == 1
          ? file[0]?.size <= MAX_FILE_SIZE
            ? true
            : false
          : true,
      "Max file size allowed is 8MB."
    ),
});

const options = [
  { label: "user1", value: "user1" },
  { label: "user2", value: "user2" },
];

export default function CreateGroup() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      members: [],
      img: null,
      description: "",
    },
  });
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleUnselect = useCallback((framework) => {
    setSelected((prev) => prev.filter((s) => s.value !== framework.value));
  }, []);

  const handleKeyDown = useCallback((e) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          setSelected((prev) => {
            const newSelected = [...prev];
            newSelected.pop();
            return newSelected;
          });
        }
      }
      // This is not a default behaviour of the <input /> field
      if (e.key === "Escape") {
        input.blur();
      }
    }
  }, []);

  const selectables = options?.filter(
    (framework) => !selected.includes(framework)
  );

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
      <Card className="overflow-hidden">
        <ScrollArea className="max-h-[calc(100vh-100px)]">
          <CardHeader>
            <CardTitle>Create Group</CardTitle>
            <CardDescription>
              Connecting Innovators and Visionaries
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <CardContent className="grid gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel>Group Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Group Name" {...field} />
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
                <Command
                  onKeyDown={handleKeyDown}
                  className="overflow-visible bg-transparent gap-1"
                >
                  <Label>Members</Label>
                  <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                    <div className="flex flex-wrap gap-1">
                      {selected.map((framework) => {
                        return (
                          <Badge key={framework.value} variant="secondary">
                            {framework.label}
                            <button
                              className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleUnselect(framework);
                                }
                              }}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              onClick={() => handleUnselect(framework)}
                            >
                              <X className="h-3 w-3 text-muted hover:text-foreground" />
                            </button>
                          </Badge>
                        );
                      })}
                      {/* Avoid having the "Search" Icon */}
                      <CommandPrimitive.Input
                        ref={inputRef}
                        value={inputValue}
                        onValueChange={setInputValue}
                        onBlur={() => setOpen(false)}
                        onFocus={() => setOpen(true)}
                        placeholder="Select User..."
                        className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted"
                      />
                    </div>
                  </div>
                  <div className={`relative ${open ? "block mt-2" : "hidden"}`}>
                    <CommandList>
                      {open && selectables.length > 0 ? (
                        <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                          <CommandGroup className="h-full overflow-auto">
                            {selectables.map((framework) => {
                              return (
                                <CommandItem
                                  key={framework.value}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  onSelect={() => {
                                    setInputValue("");
                                    setSelected((prev) => [...prev, framework]);
                                  }}
                                  className={"cursor-pointer"}
                                >
                                  {framework.label}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </div>
                      ) : null}
                    </CommandList>
                  </div>
                </Command>
                <FormField
                  control={form.control}
                  name="img"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Pick Image"
                          type="file"
                          {...field}
                        />
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
    </section>
  );
}
