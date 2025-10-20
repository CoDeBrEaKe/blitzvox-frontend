"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getClientData, getUsers } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { BASE_URL, variableData } from "@/redux/type";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";

interface FormData {
  title: string;
  first_name: string;
  family_name: string;
  birth_date: string | null;
  company_name: string;
  street: string;
  city: string;
  zip_code: string;
  house_num: string;
  phone: string;
  email: string;
  user_id: number | null;
  admin_note: string;
}

// New interface for feedback form
interface FeedbackFormData {
  feedback: string;
}

const Page = ({ params }: { params: { id: number } }) => {
  const { user, loading } = useAppSelector((state) => state.auth);
  const [users, setUsers] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const id = params.id;
  // Main form for client data
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty, isValid },
    reset,
    watch,
  } = useForm<FormData>({
    mode: "onChange",
  });

  // Submit main client form
  const onSubmit = async (data: FormData) => {
    try {
      data = {
        ...data,
        birth_date: data.birth_date ? data.birth_date : null,
      };
      const response = await axios.post(`${BASE_URL}/clients`, data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status == 201 || response.status == 200) {
        alert("Client created successfully!");
        reset();
      } else {
        alert("Failed to create client data");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error creating client data");
    }
  };

  useEffect(() => {
    async function getAgents() {
      try {
        setIsLoading(true);
        const users = await getUsers();
        setUsers(users.users);
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getAgents();
  }, [reset]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="px-8 py-4  my-5 mx-10 md:mx-0  rounded-2xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-xl md:text-2xl font-semibold mb-10">
          Client Details:
        </h1>
        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between">
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="title" className="flex-1">
              Title:
            </label>
            <Input
              {...register("title")}
              id="title"
              className="max-w-[350px]"
            />
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="first_name" className="flex-1">
              Vorname:
            </label>
            <Input
              {...register("first_name")}
              id="first_name"
              className="max-w-[350px] text-lg font-medium"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between">
          <div className="flex justify-between items-center gap-5 min-w-[40%] mt-6">
            <label htmlFor="family_name" className="flex-1">
              Nachname:
            </label>
            <Input
              {...register("family_name")}
              id="family_name"
              className="max-w-[350px] text-lg font-medium"
            />
          </div>
        </div>
        <hr className="bg-[#eee] h-[1px] w-full my-6" />

        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between">
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="birth_date" className="flex-1">
              Geburtsdatum:
            </label>
            <Input
              {...register("birth_date")}
              id="birth_date"
              type="date"
              className="max-w-[350px]"
            />
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="company_name" className="flex-1">
              Firma:
            </label>
            <Input
              {...register("company_name")}
              id="company_name"
              className="max-w-[350px]"
            />
          </div>
        </div>

        <hr className="bg-[#eee] h-[1px] w-full my-6" />

        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between">
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="street" className="flex-1">
              Straße:
            </label>
            <Input
              {...register("street")}
              id="street"
              className="max-w-[350px]"
            />
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="city" className="flex-1">
              Stadt:
            </label>
            <Input {...register("city")} id="city" className="max-w-[350px]" />
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between my-6">
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="zip_code" className="flex-1">
              Postleitzahl:
            </label>
            <Input
              {...register("zip_code")}
              id="zip_code"
              className="max-w-[350px]"
            />
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="house_num" className="flex-1">
              Hausnummer:
            </label>
            <Input
              {...register("house_num")}
              id="house_num"
              className="max-w-[350px]"
            />
          </div>
        </div>

        <hr className="bg-[#eee] h-[1px] w-full my-6" />

        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between">
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="phone" className="flex-1">
              Telefon:
            </label>
            <Input
              {...register("phone")}
              id="phone"
              className="max-w-[350px]"
            />
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="email" className="flex-1">
              Email:
            </label>
            <Input
              {...register("email", { required: true })}
              type="email"
              id="email"
              className="max-w-[350px]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between my-6">
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="user_id" className="flex-1">
              Zugewiesen an:
            </label>
            <Controller
              name="user_id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} required>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Toewijzen aan" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((agent: variableData) =>
                      agent.role === "agent" ? (
                        <SelectItem key={agent.id} value={agent.id.toString()}>
                          {agent.name}
                        </SelectItem>
                      ) : null
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            <input type="hidden" {...register("user_id")} />
          </div>
        </div>

        <hr className="bg-[#eee] h-[1px] w-full my-6" />

        <div className="flex flex-col items-stretch gap-6 md:flex justify-between md:items-center my-6">
          <div className="flex justify-between items-center gap-5 min-w-[80%] mb-10">
            <label htmlFor="admin_note" className="flex-1">
              Admin-Notiz:
            </label>
            <Input
              {...register("admin_note")}
              disabled={user?.role == "admin" ? false : true}
              id="admin_note"
              className="max-w-[350px]"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={!isDirty}
          className={`self-center text-center mx-auto px-10 py-4 center flex justify-center cursor-pointer rounded-2xl text-xl ${
            isDirty
              ? "bg-[#e4674b] hover:bg-[#d4563a]"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isDirty ? "maken" : "maken"}
        </Button>
      </form>
    </div>
  );
};

export default Page;
