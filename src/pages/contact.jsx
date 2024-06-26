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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useAuth from "@/hooks/useAuth";
import { axiosBase } from "@/services/BaseService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  reason: z.string(),
  message: z.string(),
});

const reasonOptions = [
  { label: "Help", value: "help" },
  { label: "Suggestion", value: "suggestion" },
];

export default function Contact() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
      message: "",
    },
  });

  const { auth } = useAuth();

  const { mutate: sendMessage, isPending: isSending } = useMutation({
    mutationFn: (data) =>
      axiosBase.post(
        "/users/contact",
        {
          ...data,
          name: `${auth.user.firstName} ${auth.user.lastName}`,
          email: auth.user.email,
        },
        { headers: { Authorization: auth.access_token } }
      ),
    onSuccess: () => toast.success("Message Sent Successfully"),
    onError: () => toast.error("Something went wrong"),
    onSettled: () => form.reset(),
  });

  return (
    <main className="max-w-xl w-full mx-auto py-20 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Get in touch</CardTitle>
          <CardDescription>
            Fill out the form below to get in touch with Oxsaid.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(sendMessage)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>reason</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Reason" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {reasonOptions.map((item) => (
                          <SelectItem value={item.value} key={item.value}>
                            {item.label}
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
                name="message"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Message" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={isSending}
                className="w-full flex items-center gap-2"
                type="submit"
              >
                {isSending ? (
                  <>
                    <LoaderCircle className="animate-spin w-5 h-5 text-accent" />
                    Sending...
                  </>
                ) : (
                  "Send"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
