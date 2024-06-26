"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoaderCircle, X } from "lucide-react";
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
import useAuth from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  name: z.string(),
  groupMembers: z.array(),
  description: z.string(),
  groupCoverImage: z
    .any()
    .optional()
    .refine(
      (file) =>
        file?.length === 1
          ? ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type)
          : true,
      "Invalid file. choose either JPEG or PNG image"
    )
    .refine(
      (file) => (file?.length === 1 ? file[0]?.size <= MAX_FILE_SIZE : true),
      "Max file size allowed is 8MB."
    ),
});

export default function CreateGroup() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      groupMembers: [],
      groupCoverImage: null,
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

  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      axiosBase.get("/users", {
        headers: { Authorization: auth.access_token },
      }),
    select: (data) =>
      data.data.map((item) => ({
        label: item.email,
        value: item._id,
      })),
  });
  const selectables = users?.filter(
    (framework) => !selected.includes(framework)
  );

  const { mutate: createGroup, isPending: isCreating } = useMutation({
    mutationFn: (data) =>
      axiosBase.post(
        "/groups",
        {
          ...data,
          userId: auth.user._id,
          isPrivate: false,
          groupMembers: selectables?.map((item) => item.value).join(","),
        },
        {
          headers: {
            Authorization: auth.access_token,
            "Content-Type": "multipart/form-data",
          },
        }
      ),
    onSuccess: () => {
      toast.success("Group Created 🎉");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: () => toast.error("Something went wrong"),
    onSettled: () => {
      form.reset();
      inputRef.current.reset();
    },
  });

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
            <form
              onSubmit={form.handleSubmit(createGroup)}
              className="space-y-4"
            >
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
                  name="groupCoverImage"
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
                    disabled={isCreating}
                    className="w-full flex items-center gap-2"
                    type="submit"
                  >
                    {isCreating ? (
                      <>
                        <LoaderCircle className="animate-spin w-5 h-5 text-accent" />
                        Creating...
                      </>
                    ) : (
                      "Create"
                    )}
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
