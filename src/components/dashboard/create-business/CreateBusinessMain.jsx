"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { axiosBase } from "@/services/BaseService";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import CreateBusinessForm from "../business/BusinessForm";

const formSchema = z.object({
  name: z.string().min(1, "Business Name is required."),
  address: z.string().min(1, "Business Address is required."),
  phone: z.string().min(1, "Business Phone is required."),
  email: z.string().email("Invalid email format."),
  websiteUrl: z.string().min(1, "Website URL is required."),
  description: z.string().min(1, "Business Description is required."),
  occupation: z.string().min(1, "Occupation is required."),
  subOccupation: z.string().min(1, "Sub-occupation is required."),
  size: z.number().positive("Size must be a positive number."),
  visibility: z.string().min(1, "Visibility is required."),
  isAlumniOwned: z.boolean(),
  isLessThanTwoYears: z.boolean(),
  yearFounded: z.number().optional().refine(val => !val || val <= new Date().getFullYear(), {
    message: "Year Founded must not be in the future.",
  }),
  picture: z.instanceof(File).optional()
});

export default function CreateBusinessMain() {
  const { auth } = useAuth();
  const [preview, setPreview] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "t",
      email: "t@t.com",
      phone: "604-644-2433",
      occupation: "",
      subOccupation: "",
      address: "1855 w.54",
      description: "asfda",
      websiteUrl: "www.coom.com",
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

  const onSubmit = async (data) => {
    setIsCreating(true);
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

    try {
      await axiosBase.post(
        "businesses",
        formData,
        { headers: { Authorization: auth.access_token, "Content-Type": "multipart/form-data" } }
      );
      toast.success("Business Created 🎉");

      // Log the current search parameters
      console.log("Current location.search:", location.search);
      console.log("Navigating to mine tab...");

   
    } catch (error) {
      console.error("Error creating business:", error);
      toast.error("Something went wrong");
    } finally {
      setIsCreating(false);
      form.reset();
         // Navigate to "mine" tab
         if (location.search.includes('tab=mine')) {
          console.log("Refreshing the page...");
          navigate(0); // Refresh the page if already on the "mine" tab
        } else {
          console.log("Navigating to mine tab...");
          navigate('/business?tab=mine'); // Change to "mine" tab
        }
    }
  };

  return (
    <CreateBusinessForm
      form={form}
      handleFileChange={handleFileChange}
      createBusiness={form.handleSubmit(onSubmit)}
      isCreating={isCreating}
      preview={preview}
      formState={form.formState}
    />
  );
}
