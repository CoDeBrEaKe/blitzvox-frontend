"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getClientSubData, getFeedbacks } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/redux/type";
import { useFieldArray, useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
  order_num: string;
  your_order_num: string;
  cost: string;
  status: string | null;
  counter_number: string;
  consumption: string;
  night_consumption: string;
  paid: string | boolean;
  paid_date: string | null;
  rl: string | boolean;
  rl_date: string | null;
  termination_date: string | null;
  restablish_date: string | null;
  sign_date: string | null;
  start_importing: string | null;
  end_importing: string | null;
  contract_end: string | null;
  contract_time: string;
  family_count: string;
  persons_name: any[];
  documents_link: string;
}
interface FeedbackFormData {
  feedback: string;
}
const Page = ({ params }: { params: Promise<{ id: number }> }) => {
  const [clientSub, setClientSub] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]); // Separate state for feedbacks
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const [pageState, setPageState] = useState({
    error: "",
    success: "",
  });

  const { id } = React.use(params);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
    control,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      persons_name: [""],
    },
    mode: "onChange",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "persons_name",
  });
  const {
    register: registerFeedback,
    handleSubmit: handleSubmitFeedback,
    reset: resetFeedback,
    formState: { errors: feedbackErrors },
  } = useForm<FeedbackFormData>();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setValue("documents_link", e.target.files[0].name, { shouldDirty: true });
    } else {
      setValue("documents_link", "", { shouldDirty: false });
    }
  };

  // Submit handler for form data and file
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    data = {
      ...data,
      rl: data.rl === "true",
      paid: data.paid === "true",
      documents_link: `${BASE_URL}/api/documents/${clientSub["client.id"]}/${clientSub["subscription.id"]}/${clientSub["client.first_name"]}`,
      persons_name: Array.isArray(data.persons_name)
        ? data.persons_name.map((f) =>
            typeof f === "object" && f !== null ? f.name : f
          )
        : [],
    };
    try {
      let updatedData = data;
      // Upload file if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("firstName", clientSub["client.first_name"] || "");
        formData.append("lastName", clientSub["client.family_name"] || "");
        formData.append("clientId", clientSub["client.id"]);
        formData.append("subscriptionId", clientSub["subscription.id"] || "");
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
      console.log(updatedData);
      const response = await axios.put(
        `${BASE_URL}/client-subscription/${id}`,
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
  const onSubmitFeedback = async (data: FeedbackFormData) => {
    try {
      setIsSubmittingFeedback(true);

      const response = await axios.post(
        `${BASE_URL}/feedbacks`, // Adjust URL as needed
        {
          ...data,
          client_sub_id: id, // Link feedback to this client
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
        const feedbacks = await getFeedbacks(id, "sub");
        setFeedbacks(feedbacks || []);
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
  useEffect(() => {
    async function getClientsub() {
      try {
        setIsLoading(true);
        const data = await getClientSubData(id);
        const feedbacks = await getFeedbacks(id, "sub");
        setClientSub(data);
        setFeedbacks(feedbacks || []);
        if (data) {
          reset({
            order_num: data.order_num || "",
            your_order_num: data.your_order_num || "",
            cost: data.cost || 0,
            status: data.status || null,
            counter_number: data.counter_number || "",
            consumption: data.consumption || 0,
            night_consumption: data.night_consumption || 0,
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
            contract_time: data.contract_time || null,
            family_count: data.family_count || 0,
            persons_name: data.persons_name || [],
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
  }, [reset, id]);

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
        <div className="flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-semibold mb-10">
            Verträgedetails:
          </h1>
          <a
            className="btn px-4 py-2 font-semibold text-base block bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
            href={`/clients/${clientSub["client.id"]}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Klienta
          </a>
        </div>
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
                  ? " " + clientSub["client.family_name"]
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
              id="your_order_num"
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
            <label htmlFor="sign_date" className="flex-1">
              Unterschriftsdatum:
            </label>
            <Input
              {...register("sign_date")}
              type="date"
              id="sign_date"
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
              type="number"
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
              Endlieferdatum:
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
              required
              id="contract_time"
              className="max-w-[350px]"
            >
              <option
                value="1 Year"
                selected={clientSub.contract_time === "1 Year"}
              >
                Ein Jahr
              </option>
              <option
                value="2 Years"
                selected={clientSub.contract_time === "2 Years"}
              >
                zwei Jahr
              </option>
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
              type="number"
              className="max-w-[350px]"
            />
          </div>
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="cost" className="flex-1">
              persons_name:
            </label>
            <div>
              {fields.map((field, index) => (
                <div key={field.id} className="flex  gap-2 mb-2">
                  <input
                    {...register(`persons_name.${index}` as const)}
                    placeholder={`Member ${index + 1}`}
                    className="border p-2 rounded flex-1"
                  />
                  <button
                    type="button"
                    hidden={index == 0}
                    onClick={() => remove(index)}
                    className="bg-red-500 text-white px-2 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => append([""])}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              + Add Member
            </button>
          </div>
        </div>
        <hr className="bg-[#eee] h-[1px] w-full my-6" />
        <div className="flex flex-col gap-4 md:flex md:flex-row md:gap-0 md:items-center justify-between my-6">
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            <label htmlFor="paid" className="flex-1">
              VAP:
            </label>
            <select {...register("paid")} id="paid" className="max-w-[350px]">
              <option value="true" selected={clientSub.paid === true}>
                Yes
              </option>
              <option value="false" selected={clientSub.paid === false}>
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
              <option value="true" selected={clientSub.rl === true}>
                Yes
              </option>
              <option value="false" selected={clientSub.rl === false}>
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
              className="max-w-[350px]"
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
          <div className="flex justify-between items-center gap-5 min-w-[40%]">
            {clientSub.documents_link && (
              <div className="flex justify-between items-center gap-5 min-w-[40%]">
                <label className="flex-1">Documents:</label>
                <a
                  href={clientSub.documents_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View Documents
                </a>
              </div>
            )}
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
