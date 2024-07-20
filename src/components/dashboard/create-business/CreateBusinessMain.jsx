"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosBase } from "@/services/BaseService";
import { toast } from "sonner";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import CreateBusinessForm from "./CreateBusinessForm";

const formSchema = z.object({
  name: z.string().nonempty("Business Name is required."),
  address: z.string().nonempty("Business Address is required."),
  phone: z.string().nonempty("Business Phone is required."),
  email: z.string().email("Invalid email format."),
  websiteUrl: z.string().nonempty("Website URL is required."),
  description: z.string().nonempty("Business Description is required."),
  occupation: z.string().nonempty("Occupation is required."),
  subOccupation: z.string().nonempty("Sub-occupation is required."),
  size: z.number().positive("Size must be a positive number."),
  visibility: z.string().nonempty("Visibility is required."),
  isAlumniOwned: z.boolean(),
  isLessThanTwoYears: z.boolean(),
  yearFounded: z.number().optional().refine(val => !val || val <= new Date().getFullYear(), {
    message: "Year Founded must not be in the future.",
  }),
  picture: z.instanceof(File).optional()
});

export default function CreateBusinessMain() {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      occupation: "",
      subOccupation: "",
      address: "",
      description: "",
      websiteUrl: "",
      size: null,
      visibility: "Public",
      isAlumniOwned: false,
      isLessThanTwoYears: false,
      yearFounded: null,
      picture: null
    }
  });

  const handleFileChange = (file) => {
    form.setValue("picture", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const { mutate: createBusiness, isPending: isCreating } = useMutation({
    mutationFn: (data) => {
      const formData = new FormData();
      for (const key in data) {
        if (data[key] !== undefined && key !== 'picture') {
          formData.append(key, data[key]);
        }
      }
      if (data.picture) {
        formData.append("picture", data.picture);
        formData.append("picturePath", data.picture.name || "");
      }
      formData.append('userId', auth.user._id);

      return axiosBase.post(
        "businesses",
        formData,
        { headers: { Authorization: auth.access_token, "Content-Type": "multipart/form-data" } }
      );
    },
    onSuccess: () => {
      toast.success("Business Created 🎉");
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Something went wrong");
    },
    onSettled: () => form.reset(),
  });

  return (
    <CreateBusinessForm
      form={form}
      handleFileChange={handleFileChange}
      createBusiness={createBusiness}
      isCreating={isCreating}
      preview={preview}
      formState={form.formState}
    />
  );
}
