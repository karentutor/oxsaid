import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { COLLEGE_DATA, MATRICULATION_YEAR_DATA, OCCUPATION_DATA } from "@/data";
import { geoData } from "@/data/geoData";
import useAuth from "@/hooks/useAuth";
import { axiosBase } from "@/services/BaseService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  college: z.string(),
  matriculationYear: z.string(),
  location: z.string(),
  city: z.string(),
  occupation: z.string(),
  subOccupation: z.string(),
  picture: z
    .instanceof(File)
    .refine((file) => file.size < 7000000, {
      message: "Your Picture must be less than 7MB.",
    })
    .optional(),
});

export default function UpdateProfile() {
  const { setAuth, auth } = useAuth();
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: auth?.user || {
      firstName: "",
      lastName: "",
      email: "",
      location: "",
      city: "",
      occupation: "",
      subOccupation: "",
      college: "",
      matriculationYear: "",
      picture: null,
    },
  });

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: (data) =>
      axiosBase.put(
        "/auth/update",
        {
          ...data,
          picture: data?.picture || auth?.user?.picturePath,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: auth.access_token,
          },
        }
      ),
    onSuccess: ({ data }) => {
      if (data?.isError) {
        toast.error(data?.msg, { richColors: true });
      } else {
        setAuth((prev) => ({ ...prev, user: data.user }));
        toast.success("Profile Updated", { richColors: true });
        navigate("/home", { replace: true });
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    },
    onError: (err) => {
      toast.error("Invalid Credentials", { richColors: true });
      console.log("error", err);
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Update Profile</h3>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(updateProfile)} className="space-y-4">
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="space-y-0 w-full">
                  <FormLabel>FirstName</FormLabel>
                  <FormControl>
                    <Input placeholder="FirstName" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="space-y-0 w-full">
                  <FormLabel>LastName</FormLabel>
                  <FormControl>
                    <Input placeholder="LastName" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="college"
              render={({ field }) => (
                <FormItem className="space-y-0 w-full">
                  <FormLabel>College</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select College" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COLLEGE_DATA.map((item) => (
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
              name="matriculationYear"
              render={({ field }) => (
                <FormItem className="space-y-0 w-full">
                  <FormLabel>Matriculation Year</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!form.watch("college")}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Matriculation Year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MATRICULATION_YEAR_DATA.map((item) => (
                        <SelectItem value={item.toString()} key={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="space-y-0 w-full">
                  <FormLabel>Location</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Location" />
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
                <FormItem className="space-y-0 w-full">
                  <FormLabel>city</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!form.watch("location")}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {geoData[form.watch("location")]?.map((item) => (
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
          </div>
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem className="space-y-0 w-full">
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
                <FormItem className="space-y-0 w-full">
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
          </div>
          <FormField
            control={form.control}
            name="picture"
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
                      onChange(event.target.files && event.target.files[0])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            readOnly
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input readOnly placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="w-fit ms-auto uppercase flex items-center gap-2"
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <LoaderCircle className="animate-spin w-5 h-5 text-accent" />
            ) : null}
            Update
          </Button>
        </form>
      </Form>
    </div>
  );
}
