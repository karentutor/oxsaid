/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { LoaderCircle, X } from "lucide-react";
import { Command as CommandPrimitive } from "cmdk";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosBase } from "@/services/BaseService";
import useAuth from "@/hooks/useAuth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { defaultGroup } from "@/pages/groups";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  groupMembers: z.array(),
  groupCoverImage: z
    .union([
      z
        .instanceof(File)
        .refine(
          (file) =>
            file &&
            ACCEPTED_IMAGE_TYPES.includes(file.type) &&
            file.size <= MAX_FILE_SIZE,
          "Invalid file. Choose either JPEG, JPG, PNG, or WEBP image. Max file size allowed is 5MB."
        ),
      z.string().nonempty({ message: "Image is required." }),
    ])
    .optional(),
});

export default function GroupForm({
  trigger,
  selectedGroup,
  setSelectedGroup,
  type = "add",
}) {
  const [open, setOpen] = useState(false);
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const inputRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  let selectables = users?.filter(
    (user) =>
      !selected.some((selectedUser) => selectedUser.value === user.value)
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: selectedGroup,
  });

  const config = {
    headers: {
      Authorization: auth.access_token,
      "Content-Type": "multipart/form-data",
    },
  };

  const { mutate: postGroup, isPending: isPosting } = useMutation({
    mutationFn: (data) => console.log("data", data),
    //   {
    //   let groupCoverImage;

    //   if (type === "add") {
    //     if (data.groupCoverImage instanceof File) {
    //       groupCoverImage = data.groupCoverImage;
    //     } else {
    //       throw new Error("Image file is required for creating a new group");
    //     }
    //   } else {
    //     if (data.groupCoverImage instanceof File) {
    //       groupCoverImage = data.groupCoverImage;
    //     } else {
    //       groupCoverImage = selectedGroup.groupCoverImage;
    //     }
    //   }

    //   const payload = {
    //     ...data,
    //     userId: auth.user._id,
    //     groupCoverImage,
    //     groupMembers: selectables?.map((item) => item.value).join(","),
    //   };

    //   if (type === "add") {
    //     return axiosBase.post("/groups", payload, config);
    //   } else {
    //     return axiosBase.put(`/groups/${selectedGroup?._id}`, payload, config);
    //   }
    // },
    onSuccess: () => {
      toast.success(type === "add" ? "Group Created 🎉" : "Group Updated 🎉");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: () => toast.error("Something went wrong"),
    onSettled: () => {
      form.reset();
      setSelectedGroup(defaultGroup);
      setSelected([]);
      setOpen(false);
    },
  });

  useEffect(() => {
    form.reset(selectedGroup);
    setSelected(
      selectedGroup.groupMembers?.map((m) => ({ label: m.email, value: m._id }))
    );
  }, [selectedGroup]);

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (val === false) {
          setSelectedGroup(defaultGroup);
          setSelected([]);
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{type === "add" ? "Add" : "Edit"} a Group</DialogTitle>
        </DialogHeader>
        {/* Form Content */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(postGroup)}>
            <ScrollArea className="max-h-[450px] !flex flex-col !gap-4 pe-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-0 px-1">
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
                  <FormItem className="space-y-0 pb-0 px-1">
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
                className="overflow-visible bg-transparent gap-1 px-1"
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
                      onBlur={() => setDropdownOpen(false)}
                      onFocus={() => setDropdownOpen(true)}
                      placeholder="Select User..."
                      className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted"
                    />
                  </div>
                </div>
                <div
                  className={`relative ${
                    dropdownOpen ? "block mt-2" : "hidden"
                  }`}
                >
                  <CommandList>
                    {dropdownOpen && selectables?.length > 0 ? (
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
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem className="space-y-0 pb-0 px-1">
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Click for Image"
                        type="file"
                        accept="image/*"
                        onChange={(group) => {
                          const file =
                            group.target.files && group.target.files[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.groupCoverImage?.message}
                    </FormMessage>
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
