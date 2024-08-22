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
import { OCCUPATION_DATA } from "@/data";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosBase } from "@/services/BaseService";
import useAuth from "@/hooks/useAuth";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { defaultFund } from "@/pages/funding";

const formSchema = z.object({
  name: z.string(),
  amount: z.number(),
  occupation: z.string(),
  subOccupation: z.string(),
  description: z.string(),
  businessId: z.string(),
});

export default function FundForm({
  trigger,
  selectedFund,
  setSelectedFund,
  type = "add",
  isSeeking = false,
  nextStep,
}) {
  const [open, setOpen] = useState(false);
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const { data: businesses } = useQuery({
    queryKey: ["businesses"],
    queryFn: () =>
      axiosBase.get("/businesses", {
        headers: { Authorization: auth.access_token },
      }),
    select: (data) =>
      data.data.businesses.map((item) => ({
        label: item.name,
        value: item._id,
      })),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...selectedFund,
      businessId: selectedFund?.businessId?._id,
    },
  });

  const { mutate: postFund, isPending: isPosting } = useMutation({
    mutationFn: (data) =>
      type === "add"
        ? axiosBase.post(
            "/fundings",
            {
              ...data,
              userId: auth.user._id,
              isSeeking,
            },
            { headers: { Authorization: auth.access_token } }
          )
        : axiosBase.put(
            // eslint-disable-next-line react/prop-types
            `/fundings/${selectedFund?._id}`,
            {
              ...data,
              userId: auth.user._id,
              isSeeking,
            },
            { headers: { Authorization: auth.access_token } }
          ),
    onSuccess: () => {
      if (type === "add") {
        toast.success("Fund Created 🎉");
      } else {
        toast.success("Fund Updated 🎉");
      }
      queryClient.invalidateQueries({ queryKey: ["fundings"] });
      nextStep && nextStep(); // Move to the next step on success
    },
    onError: () => toast.error("Something went wrong"),
    onSettled: () => {
      form.reset();
      setSelectedFund && setSelectedFund(defaultFund);
      setOpen(false);
    },
  });

  useEffect(() => {
    form.reset({
      ...selectedFund,
      businessId: selectedFund?.businessId?._id,
    });
  }, [selectedFund]);

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (val === false) {
          setSelectedFund && setSelectedFund(defaultFund);
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{type === "add" ? "Add" : "Edit"} a Fund</DialogTitle>
        </DialogHeader>
        {/* Form Content */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(postFund)}>
            <ScrollArea className="h-[400px] !flex flex-col gap-4 pe-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>Fund name</FormLabel>
                    <FormControl>
                      <Input placeholder="Fund name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessId"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>Business</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Business" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {businesses?.map((item) => (
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
                name="occupation"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
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
                  <FormItem className="space-y-0 pb-2 px-1">
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
                name="amount"
                render={({ field }) => (
                  <FormItem className="space-y-0 pb-2 px-1">
                    <FormLabel>Fund amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          field.onChange(value > 0 ? value : "");
                        }}
                        placeholder="Fund amount"
                      />
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
