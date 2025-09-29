"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { DataTableDemo } from "@/components/ui/table-app";
import { getClientData } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { BASE_URL, variableData } from "@/redux/type";

const page = ({ params }: { params: { id: number } }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit = async (data: FormData) => {
    // Client-side submission
    const response = await fetch(`${BASE_URL}/clients/${params.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Message sent!");
    }
  };
  const [client, setClient] = useState<Record<string, string>>({});
  const showcase = {
    counter_number: "Zählernummer",
    sub_image: "Vertragsdatum",
    name: "ERFASSER",
    start_importing: "Lieferbeginn",
    end_importing: "Endlieferdatum",
    status: "Auftr.-Statustext",
  };

  useEffect(() => {
    async function getClient() {
      const user = await getClientData(params.id);
      setClient(user);
    }
    getClient();
  }, []);
  if (Object.keys(client).length == 0) {
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
          Client Details:
        </h1>
        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between ">
          <div className="flex justify-between items-center gap-5 min-w-[40%] ">
            <label htmlFor="title" className="flex-1">
              Title:
            </label>
            <Input
              name="title"
              value={client.title}
              id="title"
              className="max-w-[350px]"
            />
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%] ">
            <label htmlFor="name" className="flex-1">
              Name:
            </label>
            <Input
              name="name"
              value={client.first_name + client.family_name}
              id="name"
              className="max-w-[350px] text-lg font-semibold"
            />
          </div>
        </div>
        <hr className="bg-[#eee] h-[1px] w-full my-6" />
        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between">
          <div className="flex justify-between items-center gap-5 min-w-[40%] ">
            <label htmlFor="dateofbirth" className="flex-1">
              Geburtsdatum:
            </label>
            <Input
              name="dateofbirth"
              value={client.birth_date}
              id="dateofbirth"
              className="max-w-[350px]"
            />
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%] ">
            <label htmlFor="company" className="flex-1">
              Firma:
            </label>
            <Input
              name="company"
              value={client.company_name}
              id="company"
              className="max-w-[350px]"
            />
          </div>
        </div>
        <hr className="bg-[#eee] h-[1px] w-full my-6" />

        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between">
          <div className="flex justify-between items-center gap-5 min-w-[40%] ">
            <label htmlFor="street" className="flex-1">
              Straße:
            </label>
            <Input
              name="street"
              value=""
              id="street"
              className="max-w-[350px]"
            />
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%] ">
            <label htmlFor="city" className="flex-1">
              Stadt:
            </label>
            <Input
              name="city"
              value={client.city}
              id="city"
              className="max-w-[350px]"
            />
          </div>
        </div>
        <div className="flex justify-between items-center my-6">
          <div className="flex justify-between items-center gap-5 min-w-[40%] ">
            <label htmlFor="zip_code" className="flex-1">
              Postleitzahl:
            </label>
            <Input
              name="zip_code"
              value={client.zip_code}
              id="zip_code"
              className="max-w-[350px]"
            />
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%] ">
            <label htmlFor="house_num" className="flex-1">
              Hausnummer:
            </label>
            <Input
              name="house_num"
              value={client.house_num}
              id="house_num"
              className="max-w-[350px]"
            />
          </div>
        </div>
        <hr className="bg-[#eee] h-[1px] w-full my-6" />
        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between">
          <div className="flex justify-between items-center gap-5 min-w-[40%] ">
            <label htmlFor="phone" className="flex-1">
              Telefon:
            </label>
            <Input
              name="phone"
              value={client.phone}
              id="phone"
              className="max-w-[350px]"
            />
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%] ">
            <label htmlFor="email" className="flex-1">
              Email:
            </label>
            <Input
              name="email"
              value={client.email}
              id="email"
              className="max-w-[350px]"
            />
          </div>
        </div>
        <div className="flex justify-between items-center my-6">
          <div className="flex justify-between items-center gap-5 min-w-[40%] ">
            <label htmlFor="assigned_to" className="flex-1">
              Zugewiesen an:
            </label>
            <Input
              name="assigned_to"
              value={(client as any).assignedTo.name}
              id="assigned_to"
              className="max-w-[350px]"
            />
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%] ">
            <label htmlFor="subscriptions" className="flex-1">
              Abonnements:
            </label>
            <div className="flex justify-center items-center gap-4">
              {(client as any).subscriptions.map(
                (sub: Record<string, string>) => {
                  (sub as any).type.sub_image;
                }
              )}
            </div>
          </div>
        </div>
        <hr className="bg-[#eee] h-[1px] w-full my-6" />

        <div className="flex justify-between items-center my-6">
          <div className="flex justify-between items-center gap-5 min-w-[40%] ">
            <label htmlFor="admin_note" className="flex-1">
              Admin-Notiz :
            </label>
            <Input
              name="admin_note"
              value={client.admin_note}
              id="admin_note"
              className="max-w-[350px]"
            />
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%] ">
            <label htmlFor="total" className="flex-1">
              Gesamtprovision:
            </label>
            <div className="flex justify-center items-center ">
              {(client as any).subscriptions.reduce(
                (total: number, sub: Record<string, string>) => {
                  (sub as any).cost + total;
                },
                0
              )}
            </div>
          </div>
        </div>
        <Button className="self-center text-center mx-auto px-10 py-4 center flex justify-center cursor-pointer rounded-2xl text-xl bg-[#e4674b]">
          Save
        </Button>
      </form>
      <hr className="bg-[#eee] h-[1px] w-full my-6" />
      <h2 className="text-xl md:text-2xl font-semibold py-10">Abonnements</h2>
      <DataTableDemo
        data={(client as any).subs.map((sub: any) => {
          return {
            ...sub,
            ...sub.creator,
          };
        })}
        showcase={showcase}
        url={"subscriptions"}
      />
      <h2 className="text-xl md:text-2xl font-semibold py-10">Feedbacks</h2>

      <hr className="bg-[#eee] h-[1px] w-full my-6" />
      {(client as any).feedbacks.map((feed: any) => (
        <div className="flex justify-center gap-30 items-center w-[70%] m-auto">
          <div className="flex justify-between items-center min-w-[30%] gap-4">
            <p className="flex-1">Feedback:</p>
            <p className="max-w-[350px]">{feed.feedback}</p>
          </div>
          <div className="flex justify-between items-center min-w-[30%] gap-4">
            <p className="flex-1">Datum:</p>
            <p className="max-w-[350px]">{feed.created_at.split("T")[0]}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default page;
