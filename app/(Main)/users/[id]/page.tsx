"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSubscriptionTypeData, getUserData } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/redux/type";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAppSelector } from "@/redux/hooks";

interface FormData {
  name: string;
  username: string;
  role: string;
}

const Page = ({ params }: { params: Promise<{ id: number }> }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [userData, setUserData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [pageState, setPageState] = useState({
    error: "",
    success: "",
  });
  const { id } = React.use(params);

  // Main form for client data
  const {
    register,
    handleSubmit,

    formState: { errors, isDirty, isValid },
    reset,
  } = useForm<FormData>({
    mode: "onChange",
  });

  // Submit main client form
  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.put(`${BASE_URL}/users/${id}`, data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
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
    async function getUser() {
      try {
        setIsLoading(true);
        const data = await getUserData(id);
        setUserData(data);

        // Reset form with client data when it's loaded
        if (data) {
          reset({
            name: data.name || "",
            username: data.username || "",
            role: data.role || "",
          });
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getUser();
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
              name:
            </label>
            <Input
              {...register("name")}
              id="sub_name"
              disabled={user?.role == "admin" ? false : true}
              className="max-w-[350px] text-lg font-medium"
            />
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="comapny" className="">
              username:
            </label>
            <Input
              {...register("username")}
              disabled={user?.role == "admin" ? false : true}
              id="sub_name"
              className="max-w-[350px] text-lg font-medium"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between">
          <div className="flex justify-between items-center gap-5 min-w-[40%] mt-6">
            <label htmlFor="your_order_num" className="flex-1">
              rol:
            </label>
            <select
              id="sub_type"
              {...register("role")}
              // disabled={user?.role == "admin" ? false : true}
              disabled
              className="max-w-[350px] text-lg font-medium"
            >
              <option value="" selected disabled>
                Choose
              </option>
              <option value="admin">admin</option>
              <option value="agent">agent</option>
            </select>
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

        {/* <Button
          type="submit"
          disabled={!isDirty}
          className={`self-center text-center mx-auto px-10 py-4 my-15 center flex justify-center cursor-pointer rounded-2xl text-xl ${
            isDirty
              ? "bg-[#e4674b] hover:bg-[#d4563a]"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isDirty ? "Änderungen speichern" : "keine Änderungen"}
        </Button> */}
      </form>
    </div>
  );
};

export default Page;
