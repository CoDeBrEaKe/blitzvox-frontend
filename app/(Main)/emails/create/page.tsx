"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getEmailData } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/redux/type";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAppSelector } from "@/redux/hooks";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
  subject: string;
  content: string;
}

const Page = ({ params }: { params: Promise<{ id: number }> }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [emailData, setEmailData] = useState<Record<string, any>>({});
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

  // Submit main client form
  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post(`${BASE_URL}/emails`, data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status == 200 || response.status == 201) {
        setPageState({
          ...pageState,
          success: "e-mail aangemaakt",
          error: "",
        });
        reset();
      }
    } catch (e: any) {
      setPageState({ ...pageState, error: e.response.data.message });
      console.error();
    }
  };

  return (
    <div className="px-8 py-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-xl md:text-2xl font-semibold mb-10">abonnement:</h1>
        <div className="flex flex-col md:flex md:flex-col md:gap-10 md:items-center ">
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="subject" className="flex-1">
              onderwerp:
            </label>
            <Input
              {...register("subject")}
              required
              id="subject"
              className="max-w-[350px] text-lg font-medium"
            />
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="inhoud" className="">
              inhoud:
            </label>
            <Textarea
              {...register("content")}
              required
              id="inhoud"
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
