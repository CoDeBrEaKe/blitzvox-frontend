"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getClientSubData,
  getSubscriptionData,
  getSubscriptionTypes,
  getUsers,
} from "@/utils/api";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/redux/type";
import { useForm } from "react-hook-form";
import axios from "axios";

interface FormData {
  sub_type: string;
  sub_image: string;
}

const Page = ({ params }: { params: Promise<{ id: number }> }) => {
  const [subscriptionTypes, setSubscriptionTypes] = useState<
    Record<string, any>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [pageState, setPageState] = useState({
    error: "",
    success: "",
  });

  // Main form for client data
  const {
    register,
    handleSubmit,

    formState: { errors, isDirty, isValid },
    reset,
  } = useForm<FormData>({
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
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
        });
        reset(data);
      }
    } catch (e: any) {
      setPageState({ ...pageState, error: e.response.data.message });
      console.error();
    }
  };
  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const users = await getSubscriptionTypes();
        setSubscriptionTypes(users);
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getData();
  }, []);

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
            <label htmlFor="sub_type" className="flex-1">
              abonnementsnaam:
            </label>
            <Input
              {...register("sub_type")}
              id="sub_name"
              className="max-w-[350px] text-lg font-medium"
            />
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="Image" className="flex-1">
              Image:
            </label>
            <Input
              id="comapny"
              {...register("sub_image")}
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
