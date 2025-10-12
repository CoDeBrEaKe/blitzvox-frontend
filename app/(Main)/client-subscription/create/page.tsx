"use client";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { use, useEffect, useState } from "react";
import { BASE_URL, variableData } from "@/redux/type";
import { useForm } from "react-hook-form";
import axios from "axios";

import { useAppSelector } from "@/redux/hooks";
import { getClientData, getSubscriptions } from "@/utils/api";

interface FormData {
  user_id: number;
  client_id: number;
  sub_id: number;
  order_num: string;
  your_order_num: string;
  cost: string;
  status: string | null;
  counter_number: string;
  consumption: string;
  night_consumption: string;
  paid: boolean | string;
  paid_date: string | null;
  rl: boolean | string;
  rl_date: string | null;
  termination_date: string | null;
  restablish_date: string | null;
  sign_date: string | null;
  start_importing: string | null;
  end_importing: string | null;
  contract_end: string | null;
  contract_time: string;
  family_count: string;
  person_num: string;
  persons_name: string;
  documents_link: string;
}

const Page = () => {
  const [subscriptions, setSubscriptions] = useState<variableData[]>([]);
  const [pageState, setPageState] = useState({
    error: "",
    success: "",
  });
  const { user } = useAppSelector((state) => state.auth);
  const searchParams = useSearchParams();
  const clientId = searchParams.get("client");
  const [client, setClient] = useState<variableData>({});
  const id = clientId ? parseInt(clientId) : NaN;
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State for file
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

  useEffect(() => {
    const getsubs = async () => {
      const subscriptions = await getSubscriptions();
      const client = await getClientData(id);
      if (subscriptions && client) {
        setSubscriptions(subscriptions.subscriptions);
        setClient(client);
      }
    };
    getsubs();
  }, []);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setValue("documents_link", e.target.files[0].name, { shouldDirty: true });
    } else {
      setValue("documents_link", "", { shouldDirty: false });
    }
  };
  // Submit main client form
  const onSubmit = async (data: FormData) => {
    data = {
      ...data,
      client_id: id,
      user_id: (user as any)?.id,
      rl: data.rl == "true" ? true : false,
      paid: data.paid == "true" ? true : false,
      documents_link: `${BASE_URL}/api/documents/${client.id}/${data.sub_id}/${client.first_name}`,
      paid_date: data.paid_date || null,
      restablish_date: data.restablish_date || null,
      rl_date: data.rl_date || null,
      sign_date: data.sign_date || null,
      start_importing: data.start_importing || null,
      end_importing: data.end_importing || null,
      termination_date: data.termination_date || null,
    };
    try {
      let updatedData = data;
      // Upload file if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("firstName", client.first_name || "");
        formData.append("clientId", client.id);
        formData.append("subscriptionId", data.sub_id.toString() || "");
        const uploadResponse = await axios.post(
          `${BASE_URL}/api/documents/upload`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (uploadResponse.status === 200) {
          const { key } = uploadResponse.data;
          updatedData = {
            ...data,
          };
        }
      }

      // Update client subscription
      const response = await axios.post(
        `${BASE_URL}/client-subscription`,
        updatedData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setPageState({
          ...pageState,
          success: "Abbointe succesvol bijgewerkt",
          error: "",
        });
        reset(updatedData);
        setSelectedFile(null); // Clear file after successful upload
      }
    } catch (e: any) {
      setPageState({
        ...pageState,
        error: e.response?.data?.message || "Error",
      });
      console.error(e);
    }
  };

  return (
    <div className="px-8 py-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-xl md:text-2xl font-semibold mb-10">
          Verträgedetails:
        </h1>
        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between">
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="order_num" className="flex-1">
              Auftr.-Nr.:
            </label>
            <Input
              id="order_num"
              {...register("order_num")}
              className="max-w-[350px] text-lg font-medium"
            />
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="your_order_num" className="flex-1">
              Ihre Auftr.-Nr.:
            </label>
            <Input
              id="family_name"
              {...register("your_order_num")}
              className="max-w-[350px] text-lg font-medium"
            />
          </div>
        </div>
        <div className="flex flex-col my-6 gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between">
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="order_num" className="flex-1">
              abonnement:
            </label>
            <select
              {...register("sub_id", { required: true })}
              id="sub_id"
              className="cursor-pointer rounded-md border-1 px-4 py-2 font-medium text-sm"
            >
              <option value="" selected>
                kies abonnement
              </option>
              {subscriptions?.map((sub) => (
                <option value={sub.id}>{sub.sub_name}</option>
              ))}
            </select>
          </div>
        </div>
        <hr className="bg-[#eee] h-[1px] w-full my-6" />
        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between">
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="street" className="flex-1">
              Unterschriftsdatum”:
            </label>
            <Input
              {...register("sign_date")}
              id="street"
              type="date"
              className="max-w-[350px]"
            />
          </div>
        </div>
        <hr className="bg-[#eee] h-[1px] w-full my-6" />

        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between my-6">
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="status" className="flex-1">
              Auftr.-Statustext:
            </label>
            <Input
              id="status"
              {...register("status")}
              className="max-w-[350px]"
            />
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="counter_number" className="flex-1">
              Zählernummer:
            </label>
            <Input
              id="counter_number"
              {...register("counter_number")}
              className="max-w-[350px]"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between">
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="termination_date" className="flex-1">
              Termination Date:
            </label>
            <Input
              {...register("termination_date")}
              id="termination_date"
              type="date"
              className="max-w-[350px]"
            />
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="restablish_date" className="flex-1">
              Restablish Date:
            </label>
            <Input
              {...register("restablish_date")}
              id="restablish_date"
              type="date"
              className="max-w-[350px]"
            />
          </div>
        </div>
        <hr className="bg-[#eee] h-[1px] w-full my-6" />

        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between my-6">
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="consumption" className="flex-1">
              Verbrauch:
            </label>
            <Input
              {...register("consumption")}
              type="number"
              id="consumption"
              className="max-w-[350px]"
            />
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="night_consumption" className="flex-1">
              Verbrauch NT:
            </label>
            <Input
              {...register("night_consumption")}
              id="night_consumption"
              type="number"
              className="max-w-[350px]"
            />
          </div>
        </div>
        <hr className="bg-[#eee] h-[1px] w-full my-6" />
        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between my-6">
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="start_importing" className="flex-1">
              Lieferbeginn:
            </label>
            <Input
              {...register("start_importing")}
              id="start_importing"
              className="max-w-[350px]"
              type="date"
            />
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="end_importing" className="flex-1">
              Endlieferdatum :
            </label>
            <Input
              {...register("end_importing")}
              type="date"
              id="end_importing"
              className="max-w-[350px]"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between my-6">
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="contract_time" className="flex-1">
              Vertragsdauer:
            </label>
            <select
              {...register("contract_time")}
              id="contract_time"
              className="max-w-[350px]"
            >
              <option value="1 Year">Ein Jahr</option>
              <option value="2 Years">zwei Jahr</option>
            </select>
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="cost" className="flex-1">
              Provision:
            </label>
            <Input
              {...register("cost")}
              id="cost"
              type="number"
              className="max-w-[350px]"
            />
          </div>
        </div>
        <hr className="bg-[#eee] h-[1px] w-full my-6" />
        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between my-6">
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="family_count" className="flex-1 text-nowrap">
              aantal gezinsleden in abonnement:
            </label>
            <Input
              {...register("family_count")}
              id="family_count"
              className="max-w-[350px]"
            />
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="cost" className="flex-1">
              persons_name:
            </label>
            <Input id="cost" className="max-w-[350px]" />
          </div>
        </div>
        <hr className="bg-[#eee] h-[1px] w-full my-6" />
        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between my-6">
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="paid" className="flex-1">
              VAP:
            </label>
            <select {...register("paid")} id="paid" className="max-w-[350px]">
              <option value="" selected>
                Kies
              </option>

              <option value={"true"}>Yes</option>
              <option value={"false"}>No</option>
            </select>
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="paid_date" className="flex-1">
              VAP DATUM:
            </label>
            <Input
              {...register("paid_date")}
              id="paid_date"
              type="date"
              className="max-w-[350px]"
            />
          </div>
        </div>
        <hr className="bg-[#eee] h-[1px] w-full my-6" />
        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between my-6">
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="rl" className="flex-1">
              RL:
            </label>
            <select {...register("rl")} id="rl" className="max-w-[350px]">
              <option value="" selected>
                Kies
              </option>
              <option value={"true"}>Yes</option>
              <option value={"false"}>No</option>
            </select>
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="rl_date" className="flex-1">
              RL DATUM:
            </label>
            <Input
              {...register("rl_date")}
              id="rl_date"
              type="date"
              className="max-w-[350px] "
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex md:flex-row md:justify-between md:items-center justify-center my-20">
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="documents_link" className="flex-1">
              Dokumente hochladen:
            </label>
            <Input
              id="documents_link"
              type="file"
              onChange={handleFileChange} // Handle file selection
              className="max-w-[350px]"
            />
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%]"></div>
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
