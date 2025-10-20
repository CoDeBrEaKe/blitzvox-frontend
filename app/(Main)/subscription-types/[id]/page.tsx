"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSubscriptionTypeData } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/redux/type";
import { useForm } from "react-hook-form";
import axios from "axios";

interface FormData {
  sub_type: string;
  sub_image: string;
}

const Page = ({ params }: { params: Promise<{ id: number }> }) => {
  const [subscriptionType, setSubscriptionType] = useState<Record<string, any>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [pageState, setPageState] = useState({
    error: "",
    success: "",
  });
  const { id } = React.use(params);

  // Main form for client data
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isValid },
    reset,
  } = useForm<FormData>({
    mode: "onChange",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setValue("sub_image", e.target.files[0].name, { shouldDirty: true });
    } else {
      setValue("sub_image", "", { shouldDirty: false });
    }
  };
  // Submit main client form
  const onSubmit = async (data: FormData) => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("data", JSON.stringify({ ...data }));
      try {
        const response = await axios.put(
          `${BASE_URL}/subscription-types/${id}`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status == 200 || response.status == 201) {
          setPageState({
            ...pageState,
            success: "Abbointe succesvol bijgewerkt",
            error: "",
          });
          reset(data);
          window.location.reload();
        }
      } catch (e: any) {
        setPageState({ ...pageState, error: e.response.data.message });
      }
    }
    try {
      const response = await axios.put(
        `${BASE_URL}/subscription-types/${id}`,
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status == 200 || response.status == 201) {
        setPageState({
          ...pageState,
          success: "Abbointe succesvol bijgewerkt",
          error: "",
        });
        reset(data);
        window.location.reload();
      }
    } catch (e: any) {
      setPageState({ success: "", error: "e.response.data.message " });
    }
  };

  useEffect(() => {
    async function getSubscription() {
      try {
        setIsLoading(true);
        const data = await getSubscriptionTypeData(id);
        setSubscriptionType(data);

        // Reset form with client data when it's loaded
        if (data) {
          reset({
            sub_type: data.sub_type || "",
            sub_image: data.sub_image || "",
          });
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getSubscription();
  }, [reset]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <div className="px-8 py-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-xl md:text-2xl font-semibold mb-10">abonnement:</h1>
        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between">
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="sub_name" className="flex-1">
              abonnementstype:
            </label>
            <Input
              {...register("sub_type")}
              id="sub_name"
              className="max-w-[350px] text-lg font-medium"
            />
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%] mt-6">
            <label htmlFor="your_order_num" className="flex-1">
              Pictogram toevoegen:
            </label>
            <img
              src={subscriptionType.sub_image}
              className="max-w-[350px] text-lg font-medium"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-center py-5">
          <div className="flex justify-center items-center gap-5 min-w-[40%] mt-6">
            <label htmlFor="your_order_num" className="flex-1">
              upload:
            </label>
            <Input
              id="sub_image"
              onChange={handleFileChange}
              type="file"
              className="max-w-[350px] text-lg font-medium"
            />
          </div>
        </div>

        {pageState.error && (
          <p className="text-red-500 text-sm font-medium w-full text-center">
            {pageState.error}
          </p>
        )}
        {pageState.success && (
          <p className="text-green-500 text-sm font-medium w-full text-center">
            {pageState.success}
          </p>
        )}

        <Button
          type="submit"
          disabled={!isDirty}
          className={`self-center text-center mx-auto px-10 py-4 my-15 center flex justify-center cursor-pointer rounded-2xl text-xl ${
            isDirty
              ? "bg-[#e4674b] hover:bg-[#d4563a]"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isDirty ? "Änderungen speichern" : "keine Änderungen"}
        </Button>
      </form>
    </div>
  );
};

export default Page;
