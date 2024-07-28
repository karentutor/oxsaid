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
import { useForm } from "react-hook-form";
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
import { geoData } from "@/data/geoData";
import { OCCUPATION_DATA } from "@/data";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosBase } from "@/services/BaseService";
import useAuth from "@/hooks/useAuth";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { defaultBusiness } from "@/pages/businesses";

const formSchema = z.object({
  name: z.string(),
  address: z.string(),
  country: z.string(),
  city: z.string(),
  phone: z.string(),
  email: z.string(),
  description: z.string(),
  size: z.number(),
  isAlumniOwned: z.boolean(),
  yearFounded: z.number(),
  occupation: z.string(),
  subOccupation: z.string(),
  websiteUrl: z.string().optional(),
  picturePath: z.any().optional(),
});

export default function BusinessForm({
  trigger,
  selectedBusiness,
  setSelectedBusiness,
  type = "add",
}) {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: selectedBusiness,
  });

  const { mutate: postBusiness, isPending: isPosting } = useMutation({
    mutationFn: (data) => {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "picturePath" && data[key][0]) {
          formData.append(key, data[key][0]);
        } else {
          formData.append(key, data[key]);
        }
      });

      return type === "add"
        ? axiosBase.post("/businesses", formData, {
            headers: {
              Authorization: auth.access_token,
              "Content-Type": "multipart/form-data",
            },
          })
        : axiosBase.put(`/businesses/${selectedBusiness?._id}`, formData, {
            headers: {
              Authorization: auth.access_token,
              "Content-Type": "multipart/form-data",
            },
          });
    },
    onSuccess: () => {
      if (type === "add") {
        toast.success("Business Created 🎉");
      } else {
        toast.success("Business Updated 🎉");
      }
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
    onError: () => toast.error("Something went wrong"),
    onSettled: () => {
      form.reset();
      setSelectedBusiness(defaultBusiness);
      setImagePreview(null);
    },
  });

  useEffect(() => {
    form.reset(selectedBusiness);
    setImagePreview(null);
  }, [selectedBusiness]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{type === "add" ? "Add" : "Edit"} a Business</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(postBusiness)}>
            <ScrollArea className="h-[450px] !flex flex-col gap-4 pe-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Business name" {...field} />
                    </FormControl>
                    <FormMessage />
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>Country</FormLabel>
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
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>City</FormLabel>
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
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone" {...field} />
                    </FormControl>
                    <FormMessage />
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
                    <FormMessage />
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
                      <Input placeholder="Size" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isAlumniOwned"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>Majority Alumni Owned</FormLabel>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value="true"
                          checked={field.value === true}
                          onChange={() => field.onChange(true)}
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value="false"
                          checked={field.value === false}
                          onChange={() => field.onChange(false)}
                        />
                        <span>No</span>
                      </label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="yearFounded"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>Year Founded</FormLabel>
                    <FormControl>
                      <Input placeholder="Year Founded" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>Field</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Field" />
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
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>Sub Field</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!form.watch("occupation")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Sub Field" />
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
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Website URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="picturePath"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>Picture</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          handleImageChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    {imageLoading && <p>Loading...</p>}
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mt-2 h-32 w-32 object-cover"
                      />
                    )}
                  </FormItem>
                )}
              />
            </ScrollArea>
            <DialogFooter className="px-3 pt-3">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPosting || imageLoading}
                className="w-fit flex items-center gap-2"
              >
                {isPosting || imageLoading ? (
                  <LoaderCircle className="animate-spin w-5 h-5 text-accent" />
                ) : null}
                {isPosting || imageLoading ? "Loading" : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
