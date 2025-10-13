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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [pageState, setPageState] = useState({
    error: "",
    success: "",
    loading: false,
  });

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
    setPageState({ ...pageState, loading: true });

    if (selectedImage) {
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("data", JSON.stringify({ ...data }));
      try {
        const response = await axios.post(
          `${BASE_URL}/subscription-types`,
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
            loading: false,
          });
          reset(data);
          window.location.reload();
        }
      } catch (e: any) {
        setPageState({ ...pageState, error: "something wrong happened" });
        console.error();
      }
    } else {
      try {
        const response = await axios.post(
          `${BASE_URL}/subscription-types`,
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
            loading: false,
          });
          // window.location.reload();

          reset(data);
        }
      } catch (e: any) {
        setPageState({
          ...pageState,
          error: "Something wrong happened",
          loading: false,
        });
      }
    }
  };

  return (
    <div className="px-8 py-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-xl md:text-2xl font-semibold mb-10">abonnement:</h1>
        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between">
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="sub_type" className="flex-1">
              abonnementstype:
            </label>
            <Input
              {...register("sub_type")}
              id="sub_type"
              className="max-w-[350px] text-lg font-medium"
            />
          </div>
          <div className="flex justify-center items-center gap-5 min-w-[40%] ">
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
          disabled={!isDirty || pageState.loading}
          className={`self-center text-center mx-auto px-10 py-4 my-15 center flex justify-center cursor-pointer rounded-2xl text-xl ${
            isDirty || !pageState.loading
              ? "bg-[#e4674b] hover:bg-[#d4563a]"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isDirty
            ? "Änderungen speichern"
            : !pageState.loading
            ? "Loading"
            : "keine Änderungen"}
        </Button>
      </form>
    </div>
  );
};

export default Page;
