import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { EnvelopeOpenIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Signin() {
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
      }
    },
    onError: (err) => {
      toast.error("Invalid Credentials", { richColors: true });
      console.log("error", err);
    },
  });

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="hidden bg-muted lg:block">
        <img
          src="/imgs/signin.png"
          alt="signin cover"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance">
              Enter your email below to login to your account
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(login)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
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
                  <FormItem>
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
          <div className="flex items-center gap-4 text-sm">
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
    </div>
  );
}
