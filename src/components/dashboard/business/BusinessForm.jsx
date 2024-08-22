/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
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
import { useForm, useWatch } from "react-hook-form";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosBase } from "@/services/BaseService";
import useAuth from "@/hooks/useAuth";
import { LoaderCircle, X } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { defaultBusiness } from "@/pages/business";
import { OCCUPATION_DATA, VISIBILITY_DATA } from "@/data";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

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
  // isAlumniOwned: z.boolean(),
  // isLessThanTwoYears: z.boolean(),
  yearFounded: z
    .number()
    .optional()
    .refine((val) => !val || val <= new Date().getFullYear(), {
      message: "Year Founded must not be in the future.",
    }),
  picturePath: z
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

export default function BusinessForm({
  trigger,
  selectedBusiness,
  setSelectedBusiness,
  type = "add",
  nextStep,
}) {
  const [open, setOpen] = useState(false);
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: selectedBusiness,
  });

  const config = {
    headers: {
      Authorization: auth.access_token,
      "Content-Type": "multipart/form-data",
    },
  };

  const { mutate: createBusiness, isPending: isPosting } = useMutation({
    mutationFn: (data) => {
      let picturePath;

      if (type === "add") {
        if (data.picturePath instanceof File) {
          picturePath = data.picturePath;
        } else {
          throw new Error("Image file is required for creating a new business");
        }
      } else {
        if (data.picturePath instanceof File) {
          picturePath = data.picturePath;
        } else {
          picturePath = selectedBusiness.picturePath;
        }
      }

      const payload = {
        ...data,
        userId: auth.user._id,
        time: data.date,
        picturePath,
      };

      if (type === "add") {
        return axiosBase.post("/businesses", payload, config);
      } else {
        return axiosBase.put(
          `/businesses/${selectedBusiness?._id}`,
          payload,
          config
        );
      }
    },
    onSuccess: () => {
      toast.success(
        type === "add" ? "Business Created 🎉" : "Business Updated 🎉"
      );
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      nextStep && nextStep(); // Move to the next step on success
    },
    onError: () => toast.error("Something went wrong"),
    onSettled: () => {
      form.reset();
      setSelectedBusiness && setSelectedBusiness(defaultBusiness);
      setOpen(false);
    },
  });

  useEffect(() => {
    form.reset(selectedBusiness);
  }, [selectedBusiness]);

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (val === false) {
          setSelectedBusiness && setSelectedBusiness(defaultBusiness);
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "add" ? "Add" : "Edit"} a Business
          </DialogTitle>
        </DialogHeader>
        {/* Form Content */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(createBusiness)}>
            <ScrollArea className="h-[450px] !flex flex-col gap-4 pe-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.name?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Address" {...field} />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.address?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone" {...field} />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.phone?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.email?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Visibility</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue="Public"
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
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>WebsiteUrl</FormLabel>
                    <FormControl>
                      <Input placeholder="WebsiteUrl" {...field} />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.websiteUrl?.message}
                    </FormMessage>
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
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>Size</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Size"
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (value > 0) {
                            field.onChange(value);
                          } else {
                            field.onChange("");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.size?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="yearFounded"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>YearFounded</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="YearFounded"
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (value > 0) {
                            field.onChange(value);
                          } else {
                            field.onChange("");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.yearFounded?.message}
                    </FormMessage>
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
                    <FormMessage>
                      {form.formState.errors.description?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="picturePath"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Click for Image"
                        type="file"
                        accept="image/*"
                        onChange={(business) => {
                          const file =
                            business.target.files && business.target.files[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.picturePath?.message}
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
