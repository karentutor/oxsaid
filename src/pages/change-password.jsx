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
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { axiosBase } from "@/services/BaseService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { EyeIcon, EyeOffIcon, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useState } from "react";

const formSchema = z
  .object({
    password: z.string().min(6),
    newPassword: z.string().min(6),
    confirmNewPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

export default function ChangePassword() {
  const { auth } = useAuth();
  const [showPassword, setShowPassword] = useState({
    password: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const { mutate: changePassword, isPending } = useMutation({
    mutationFn: (data) =>
      axiosBase.post(
        "/auth/change-password",
        { ...data, email: auth.user.email },
        {
          headers: {
            Authorization: `Bearer ${auth.access_token}`,
          },
        }
      ),
    onSuccess: ({ data }) => {
      if (data?.isError) {
        toast.error(data?.msg, { richColors: true });
      } else {
        toast.success("Password Updated Successfully", { richColors: true });
        navigate("/home", { replace: true });
      }
    },
    onError: (err) => {
      toast.error("Something went wrong", { richColors: true });
      console.log("error", err);
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="space-y-6 max-w-md w-full">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-center">Change Password</h3>
        </div>
        <Separator />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(changePassword)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-1.5">
                      <Input
                        type={showPassword.password ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-[38px]"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            password: !prev.password,
                          }))
                        }
                      >
                        {showPassword.password ? (
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
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-1.5">
                      <Input
                        type={showPassword.newPassword ? "text" : "password"}
                        placeholder="Enter your New password"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-[38px]"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            newPassword: !prev.newPassword,
                          }))
                        }
                      >
                        {showPassword.newPassword ? (
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
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-1.5">
                      <Input
                        type={
                          showPassword.confirmNewPassword ? "text" : "password"
                        }
                        placeholder="Confirm New Password"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-[38px]"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            confirmNewPassword: !prev.confirmNewPassword,
                          }))
                        }
                      >
                        {showPassword.confirmNewPassword ? (
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
              className="w-fit ms-auto uppercase flex items-center gap-2 mt-3"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <LoaderCircle className="animate-spin w-5 h-5 text-accent" />
              ) : null}
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
