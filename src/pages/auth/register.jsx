import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { EyeIcon, EyeOffIcon, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  college: z.string(),
  matriculationYear: z.string(),
  location: z.string(),
  city: z.string(),
  occupation: z.string(),
  subOccupation: z.string(),
  password: z.string(),
  picture: z.instanceof(File).refine((file) => file.size < 7000000, {
    message: "Your Picture must be less than 7MB.",
  }),
});

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      password: "",
    },
  });

  const { mutateAsync: register, isPending } = useMutation({
    mutationFn: (data) =>
      axiosBase.post("/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: ({ data }) => {
      if (data.isError) {
        toast.error(data.msg, { richColors: true });
      } else {
        setAuth({ user: data.user, access_token: data.token });
        toast.success("Register Success", { richColors: true });
        navigate("/home", { replace: true });
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
      }
    },
    onError: (err) => {
      toast.error("Invalid Credentials", { richColors: true });
      console.log("error", err);
    },
  });

  const onSubmit = async (values) => {
    const newUser = { ...values, picturePath: values.picture.name };
    await register(newUser);
  };

  return (
    <main className="relative">
      <div className="pattern w-full -z-50 h-screen fixed top-0 right-0 left-0 flex items-center justify-center" />
      <div className="max-w-3xl w-full mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
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
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-1.5">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-[38px]"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeIcon className="h-4 w-4 text-zinc-700" />
                            ) : (
                              <EyeOffIcon className="h-4 w-4 text-zinc-700" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="w-full uppercase flex items-center gap-2"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? (
                    <LoaderCircle className="animate-spin w-5 h-5 text-accent" />
                  ) : null}
                  Register
                </Button>
              </form>
            </Form>
            <p className="text-base mt-4 flex items-center gap-3">
              Already have an account?
              <Link className="text-accent" to="/signin">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
