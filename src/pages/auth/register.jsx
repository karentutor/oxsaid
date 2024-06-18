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
import { toast } from "@/components/ui/use-toast";
import { COLLEGE_DATA, MATRICULATION_YEAR_DATA, OCCUPATION_DATA } from "@/data";
import { geoData } from "@/data/geoData";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  college: z.string(),
  graduationYear: z.string(),
  country: z.string(),
  city: z.string(),
  occupation: z.string(),
  subOccupation: z.string(),
  password: z.string(),
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

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      country: "",
      city: "",
      occupation: "",
      subOccupation: "",
      college: "",
      graduationYear: "",
      img: null,
      password: "",
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
  }

  return (
    <main className="max-w-3xl w-full mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  name="graduationYear"
                  render={({ field }) => (
                    <FormItem className="space-y-0 w-full">
                      <FormLabel>Graduation Year</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!form.watch("college")}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Graduation Year" />
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
                  name="country"
                  render={({ field }) => (
                    <FormItem className="space-y-0 w-full">
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
                    <FormItem className="space-y-0 w-full">
                      <FormLabel>city</FormLabel>
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
                name="img"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input placeholder="Pick Image" type="file" {...field} />
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
              <Button className="w-full uppercase" type="submit">
                Register
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
