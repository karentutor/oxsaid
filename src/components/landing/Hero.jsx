import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, buttonVariants } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { ArrowDown } from "lucide-react";
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

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Hero() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync: login, isPending } = useMutation({
    mutationFn: (data) => axiosBase.post("/auth/login", data),
    onSuccess: ({ data }) => {
      if (data.isError) {
        toast.error("Invalid Credentials", { richColors: true });
      } else {
        setAuth({ user: data.user, access_token: data.token });
        toast.success("Login Success", { richColors: true });
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

  return (
    <section
      className="container grid lg:grid-cols-2 place-items-center grid-cols-1 py-24 md:py-32 gap-10"
      id="hero"
    >
      <div className="text-center lg:text-start space-y-6">
        <h1 className="inline bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text lg:text-lg">
          Empower Your Future
        </h1>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
          with Our Comprehensive Alumni Network
        </h1>

        <p className="md:text-xl lg:w-10/12 mx-auto lg:mx-0">
          Access Exclusive Business Funding, Job Opportunities, Social Groups,
          and Monthly Events to Stay Connected and Thrive
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Link to="/contact" className={`w-full md:w-1/3 ${buttonVariants()}`}>
            Contact Us
          </Link>

          <a
            href="#about"
            className={`w-full group hover:text-secondary md:w-1/3 ${buttonVariants(
              {
                variant: "outline",
              }
            )}`}
          >
            Know More
            <ArrowDown className="ml-2 w-5 h-5 text-accent group-hover:text-secondary" />
          </a>
        </div>
      </div>

      {/* Hero cards sections */}
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(login)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
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
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full flex items-center gap-2"
                disabled={isPending}
              >
                {isPending ? (
                  <LoaderCircle className="animate-spin w-5 h-5 text-accent" />
                ) : null}
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
}
