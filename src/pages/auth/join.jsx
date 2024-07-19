import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { EnvelopeOpenIcon, EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useController } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { axiosBase } from "@/services/BaseService";
import { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import { COLLEGE_DATA, MATRICULATION_YEAR_DATA, OCCUPATION_DATA } from "@/data";
import { geoData } from "@/data/geoData";

const formSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
  college: z.string().min(1, "College is required"),
  matriculationYear: z.string().min(1, "Matriculation year is required"),
  occupation: z.string().min(1, "Occupation is required"),
  subOccupation: z.string().min(1, "Sub-occupation is required"),
  location: z.string().min(1, "Location is required"),
  city: z.string().min(1, "City is required"),
  picture: z.any().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Join() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [cities, setCities] = useState([]);
  const token = new URLSearchParams(window.location.search).get('token');

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      college: "",
      matriculationYear: "",
      occupation: "",
      subOccupation: "",
      location: "",
      city: "",
      picture: null,
    },
  });

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    let email = '';
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      email = decodedToken.email;
    } catch (error) {
      navigate('/');
      return;
    }

    form.setValue('email', email);

  }, [token, navigate, form]);

  const { control, handleSubmit, setValue, watch } = form;
  const selectedCountry = watch("location");

  useEffect(() => {
    if (selectedCountry && geoData[selectedCountry]) {
      setCities(geoData[selectedCountry]);
    } else {
      setCities([]);
    }
  }, [selectedCountry]);

  const { mutateAsync: register, isPending } = useMutation({
    mutationFn: (data) => {
      const formData = new FormData();
      for (const key in data) {
        if (key === 'picture' && data[key]) {
          formData.append(key, data[key]);
        } else if (data[key]) {
          formData.append(key, data[key]);
        }
      }
      return axiosBase.post("/auth/register", formData);
    },
    onSuccess: ({ data }) => {
      if (data.isError) {
        toast.error("Registration Failed", { richColors: true });
      } else {
        setAuth({ user: data.user, access_token: data.token });
        toast.success("Registration Success", { richColors: true });
        navigate("/home", { replace: true });
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
      }
    },
    onError: (err) => {
      toast.error("Registration Failed", { richColors: true });
      console.log("error", err);
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Join</h1>
          <p className="text-balance">
            Enter your details below to create a new account
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={handleSubmit(register)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="college"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>College</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full p-2 border border-gray-300 rounded">
                      <option value="">Select College</option>
                      {COLLEGE_DATA.sort((a, b) => a.name.localeCompare(b.name)).map(
                        (college, index) => (
                          <option key={index} value={college.name}>
                            {college.name}
                          </option>
                        )
                      )}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="matriculationYear"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Matriculation Year</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full p-2 border border-gray-300 rounded">
                      <option value="">Select Year</option>
                      {MATRICULATION_YEAR_DATA.map((year, index) => (
                        <option key={index} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="location"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full p-2 border border-gray-300 rounded">
                      <option value="">Select Country</option>
                      {Object.keys(geoData).sort((a, b) => a.localeCompare(b)).map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="city"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full p-2 border border-gray-300 rounded">
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="occupation"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Occupation</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setValue("subOccupation", "");
                      }}
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="">Select Occupation</option>
                      {OCCUPATION_DATA.sort((a, b) =>
                        a.name.localeCompare(b.name)
                      ).map((occupation, index) => (
                        <option key={index} value={occupation.name}>
                          {occupation.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="subOccupation"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Sub-Occupation</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full p-2 border border-gray-300 rounded" disabled={!watch("occupation")}>
                      <option value="">Select Sub-Occupation</option>
                      {watch("occupation") &&
                        OCCUPATION_DATA.find(
                          (occupation) =>
                            occupation.name.toLowerCase() ===
                            watch("occupation").toLowerCase()
                        )
                          .sublist.sort((a, b) => a.name.localeCompare(b.name))
                          .map((subOccupation, index) => (
                            <option key={index} value={subOccupation.name}>
                              {subOccupation.name}
                            </option>
                          ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="picture"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Add Picture</FormLabel>
                  <FormControl>
                    <Dropzone
                      acceptedFiles=".jpg,.jpeg,.png"
                      multiple={false}
                      onDrop={(acceptedFiles) => setValue("picture", acceptedFiles[0])}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()} className="w-full p-4 border-2 border-dashed border-gray-300 rounded cursor-pointer">
                          <input {...getInputProps()} />
                          {!watch("picture") ? (
                            <p>Add Picture Here</p>
                          ) : (
                            <div className="flex items-center justify-between">
                              <span>{watch("picture").name}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </Dropzone>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                      <div
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon /> }
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                      <div
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="col-span-2 flex items-center gap-2"
              disabled={isPending}
            >
              {isPending ? (
                <LoaderCircle className="animate-spin w-5 h-5 text-accent" />
              ) : null}
              Register
            </Button>
          </form>
        </Form>
        <div className="flex items-center gap-4 text-sm mt-4 justify-center">
          <Button variant="outline">
            <Link to="/#about">About us</Link>
          </Button>
          <Button variant="outline">
            <Link to="/#services">Oxsaid Services</Link>
          </Button>
          <a
            href="mailto:admin@nanoosedev.com"
            target="_blank"
            rel="noreferrer"
          >
            <Button>
              <EnvelopeOpenIcon className="mr-2 h-4 w-4" /> Contact us
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
