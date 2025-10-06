"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getClientSubData, getUsers } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/redux/type";
import { useForm } from "react-hook-form";
import axios from "axios";

interface FormData {
  order_num: string;
  your_order_num: string;
  cost: string;
  status: string | null;
  counter_number: string;
  consumption: string;
  night_consumption: string;
  paid: string | boolean;
  paid_date: string;
  rl: string | boolean;
  rl_date: string;
  termination_date: number | null;
  restablish_date: string;
  sign_date: string;
  start_importing: string;
  end_importing: string;
  contract_end: string;
  contract_time: string;
  family_count: string;
  person_num: string;
  persons_name: string;
  documents_link: string;
}

const Page = ({ params }: { params: Promise<{ id: number }> }) => {
  const [clientSub, setClientSub] = useState<Record<string, any>>({});
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
    data = {
      ...data,
      rl: data.rl == "true" ? true : false,
      paid: data.paid == "true" ? true : false,
    };
    try {
      const response = await axios.put(
        `${BASE_URL}/client-subscription/${id}`,
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
    async function getClientsub() {
      try {
        setIsLoading(true);
        const data = await getClientSubData(id);
        setClientSub(data);

        // Reset form with client data when it's loaded
        if (data) {
          reset({
            order_num: data.order_num || "",
            your_order_num: data.your_order_num || "",
            cost: data.cost || "",
            status: data.status || null,
            counter_number: data.counter_number || "",
            consumption: data.consumption || "",
            night_consumption: data.night_consumption || "",
            paid: data.paid,
            paid_date: data.paid_date?.split("T")[0] || null,
            rl: data.rl,
            rl_date: data.rl_date?.split("T")[0] || null,
            termination_date: data.termination_date?.split("T")[0] || null,
            restablish_date: data.restablish_date?.split("T")[0] || null,
            sign_date: data.sign_date?.split("T")[0] || null,
            start_importing: data.start_importing?.split("T")[0] || null,
            end_importing: data.end_importing?.split("T")[0] || null,
            contract_end: data.contract_end?.split("T")[0] || null,
            contract_time: data.contract_time || "",
            family_count: data.family_count || 0,
            person_num: data.person_num || "",
            persons_name: data.persons_name || "",
            documents_link: data.documents_link || "",
          });
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getClientsub();
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
        <h1 className="text-xl md:text-2xl font-semibold mb-10">
          Verträgedetails:
        </h1>
        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between">
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="name" className="flex-1">
              Name:
            </label>
            <Input
              disabled
              id="title"
              value={
                clientSub["client.first_name"] +
                (clientSub["client.family_name"]
                  ? clientSub["client.family_name"]
                  : "")
              }
              className="max-w-[350px]"
            />
          </div>
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
        </div>
        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between">
          <div className="flex justify-between items-center gap-5 min-w-[40%] mt-6">
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
        <hr className="bg-[#eee] h-[1px] w-full my-6" />
        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between">
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="creator" className="flex-1">
              Ersteller:
            </label>
            <Input
              value={clientSub["creator.name"]}
              disabled
              className="max-w-[350px]"
            />
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="company_name" className="flex-1">
              Abo-Typ:
            </label>
            <Input
              value={clientSub["subscription.type.sub_type"]}
              className="max-w-[350px]"
            />
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
              type="date"
              id="street"
              className="max-w-[350px]"
            />
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="city" className="flex-1">
              Tarif/Produkt:
            </label>
            <Input
              id="city"
              value={clientSub["subscription.sub_name"]}
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
              type="date"
              id="termination_date"
              className="max-w-[350px]"
            />
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="restablish_date" className="flex-1">
              Restablish Date:
            </label>
            <Input
              {...register("restablish_date")}
              type="date"
              id="restablish_date"
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
              type="date"
              id="start_importing"
              className="max-w-[350px]"
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
              <option
                value="1 Year"
                selected={clientSub.contract_time == "1 Year"}
              >
                Ein Jahr
              </option>
              <option
                value="2 Years"
                selected={clientSub.contract_time == "2 Years"}
              >
                zwei Jahr
              </option>
            </select>
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="cost" className="flex-1">
              Provision:
            </label>
            <Input {...register("cost")} id="cost" className="max-w-[350px]" />
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
              <option value={"true"} selected={clientSub.paid == "true"}>
                Yes
              </option>
              <option value={"false"} selected={clientSub.paid == "false"}>
                No
              </option>
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
              <option value={"true"} selected={clientSub.rl == "true"}>
                Yes
              </option>
              <option value={"false"} selected={clientSub.rl == "false"}>
                No
              </option>
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
        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-center my-20">
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="documents_link" className="flex-1">
              Dokumente hochladen:
            </label>
            <Input
              // {...register("documents_link")}
              id="documents_link"
              type="file"
              className="max-w-[350px]"
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
