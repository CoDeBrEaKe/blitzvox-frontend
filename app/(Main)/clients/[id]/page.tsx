"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableDemo } from "@/components/ui/table-app";
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
import { Textarea } from "@/components/ui/textarea"; // Add this import
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
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

const Page = ({ params }: { params: Promise<{ id: number }> }) => {
  const { user, loading } = useAppSelector((state) => state.auth);
  const [client, setClient] = useState<Record<string, any>>({});
  const [users, setUsers] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [pageState, setPageState] = useState({
    error: "",
    success: "",
  });
  const [feedbacks, setFeedbacks] = useState<any[]>([]); // Separate state for feedbacks
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const { id } = React.use(params);
  const router = useRouter();
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

  // Separate form for feedback
  const {
    register: registerFeedback,
    handleSubmit: handleSubmitFeedback,
    reset: resetFeedback,
    formState: { errors: feedbackErrors },
  } = useForm<FeedbackFormData>();

  // Submit main client form
  const onSubmit = async (data: FormData) => {
    data = {
      ...data,
      birth_date: data.birth_date ? data.birth_date : null,
    };
    try {
      const response = await axios.put(`${BASE_URL}/clients/${id}`, data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status == 200) {
        setPageState({
          ...pageState,
          success: "Cliënt succesvol bijgewerkt",
          error: "",
        });
        reset(data);
      }
    } catch (e: any) {
      setPageState({ ...pageState, error: e.response.data.message });
      console.error();
    }
  };

  // Submit new feedback form
  const onSubmitFeedback = async (data: FeedbackFormData) => {
    try {
      setIsSubmittingFeedback(true);

      const response = await axios.post(
        `${BASE_URL}/feedbacks`, // Adjust URL as needed
        {
          ...data,
          client_id: id, // Link feedback to this client
          created_at: new Date().toISOString(),
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        alert("Feedback added sucessfully!");
        resetFeedback(); // Clear the feedback form

        // Refresh feedbacks list
        const updatedClient = await getClientData(id);
        setClient(updatedClient);
        setFeedbacks(updatedClient.feedbacks || []);
      } else {
        alert("Failed to add feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error adding feedback");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

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
      try {
        setIsLoading(true);
        const data = await getClientData(id);
        setClient(data);
        setFeedbacks(data.feedbacks || []); // Set feedbacks separately
        const users = await getUsers();
        setUsers(users.users);

        // Reset form with client data when it's loaded
        if (data) {
          reset({
            title: data.title || "",
            first_name: `${data.first_name || ""}`,
            family_name: `${data.family_name || ""}`.trim(),
            birth_date: data.birth_date?.split("T")[0] || null,
            company_name: data.company_name || "",
            street: data.street || "",
            city: data.city || "",
            zip_code: data.zip_code || "",
            house_num: data.house_num || "",
            phone: data.phone || "",
            email: data.email || "",
            user_id: parseInt(data.assigned_to?.id) || null,
            admin_note: data.admin_note || "",
          });
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getClient();
  }, [reset]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const totalProvision =
    client.subscriptions?.reduce((total: number, sub: any) => {
      return total + (sub.cost || 0);
    }, 0) || 0;

  console.log(totalProvision);
  return (
    <div className="px-8 py-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center my-10">
          <h1 className="text-xl md:text-2xl font-semibold ">
            Client Details:
          </h1>
          <Link
            href={`/client-subscription/create/?client=${client.id}`}
            className="px-4 py-2 flex items-center shadow rounded-md bg-[#28A745] text-white"
          >
            Abonnement aanmaken
          </Link>
        </div>

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
              type="date"
              {...register("birth_date")}
              id="birth_date"
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
              {...register("email")}
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
                <Select onValueChange={field.onChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={client.assigned_to.name} />
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
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="subscriptions" className="flex-1">
              Abonnements:
            </label>
            <div className="flex justify-center items-center gap-4">
              {client.subscriptions?.map((sub: any, index: number) => (
                <div key={index} className="text-sm">
                  <img src={sub.type?.sub_image || "N/A"} className="w-6 h-6" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <hr className="bg-[#eee] h-[1px] w-full my-6" />
        <div className="flex flex-col items-stretch gap-6 md:flex-row  justify-between md:items-center my-6">
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
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
          {(user as any)?.role == "admin" ? (
            <div className="flex justify-between items-center gap-5 min-w-[50%]">
              <label htmlFor="total" className="flex-1">
                Gesamtprovision:
              </label>
              <div className="flex justify-center items-center text-lg font-semibold">
                €{totalProvision.toFixed(2)}
              </div>
            </div>
          ) : (
            ""
          )}
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
      <hr className="bg-[#eee] h-[1px] w-full my-6" />
      <h2 className="text-xl md:text-2xl font-semibold py-10">Abonnements</h2>

      <Table>
        <TableHeader>
          <TableRow className="bg-amber-200 hover:bg-amber-200 ">
            {/* Dynamic columns from showcase */}
            <TableCell>Zählernummer</TableCell>
            <TableCell>ERFASSER</TableCell>
            <TableCell>Lieferbeginn</TableCell>
            <TableCell>Endlieferdatum</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {client.subs && client.subs.length > 0 ? (
            client.subs.map((row: any) => (
              <TableRow
                key={row.id}
                className="hover:cursor-pointer"
                onClick={() => router.push(`/client-subscription/${row.id}`)}
              >
                <TableCell>{row.counter_number}</TableCell>
                <TableCell>{row.creator.name}</TableCell>
                <TableCell>{row.start_importing}</TableCell>
                <TableCell>{row.end_importing}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:cursor-pointer">
              <TableCell>No Results</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <hr className="bg-[#eee] h-[1px] w-full mt-6" />
      <h2 className="text-xl md:text-2xl font-semibold py-10">Feedbacks</h2>
      <form
        onSubmit={handleSubmitFeedback(onSubmitFeedback)}
        className="flex flex-col justify-between gap-8 items-center w-[80%] lg:flex md:w-[80%] m-auto mb-8 p-6 bg-gray-50 rounded-lg"
      >
        <div className="flex justify-between items-center lg:min-w-[70%] gap-4">
          <label htmlFor="feedback" className="flex-1 text-sm md:font-medium">
            New Feedback:
          </label>
          <Textarea
            {...registerFeedback("feedback", {
              required: "Feedback is required",
              minLength: {
                value: 5,
                message: "Feedback must be at least 5 characters",
              },
            })}
            id="feedback"
            className="max-w-[500px] min-h-[80px]"
            placeholder="Enter your feedback here..."
          />
        </div>
        <div className="flex justify-between items-center min-w-[20%] gap-4">
          <Button
            type="submit"
            disabled={isSubmittingFeedback}
            className="bg-[#e4674b] hover:bg-[#d4563a] cursor-pointer"
          >
            {isSubmittingFeedback ? "Adding..." : "Add Feedback"}
          </Button>
        </div>
      </form>
      {/* Display validation errors for feedback form */}
      {feedbackErrors.feedback && (
        <p className="text-red-500 text-center mb-4">
          {feedbackErrors.feedback.message}
        </p>
      )}
      {feedbacks?.map((feed: any, index: number) => (
        <div
          key={index}
          className="flex justify-between gap-8 items-center w-[100%] lg:w-[70%] m-auto mb-4 shadow px-6 py-2 rounded-xl"
        >
          <div className="flex justify-between items-center min-w-[40%] gap-4">
            <p className="flex-1 font-medium">Feedback:</p>
            <p className="max-w-[650px] text-sm lg:text-base">
              {feed.feedback}
            </p>
          </div>
          <div className="flex justify-between items-center min-w-[40%] gap-4">
            <p className="flex-1 font-medium">Datum:</p>
            <p className="max-w-[650px] text-sm lg:text-base">
              {feed.created_at?.split("T")[0]}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Page;
