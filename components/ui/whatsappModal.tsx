import React, { useState } from "react";
import { DialogContent, DialogTrigger, Dialog } from "./dialog";
import { Button } from "./button";
import { useForm, SubmitHandler } from "react-hook-form";
import { Textarea } from "./textarea";
import { BASE_URL, variableData } from "@/redux/type";

import axios from "axios";

interface FormInputs {
  subject: string;
  content: string;
  to: string[];
}

interface ChildProps {
  selectedRows: Set<variableData>;
  active: boolean;
  page?: string;
}

export const WhatsappModal: React.FC<ChildProps> = ({
  selectedRows,
  active,
  page,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormInputs>({
    mode: "onChange",
    defaultValues: {
      subject: "",
      content: "",
    },
  });

  const [pageState, setPageState] = useState({
    loading: false,
    error: "",
    success: "",
  });
  if (page == "clientSub") {
    const to = Array.from(selectedRows).map((value) => value["client.email"]);
  }

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    let to;
    if (page == "clientSub") {
      to = [
        ...new Set(
          Array.from(selectedRows).map((value) => value["client.phone"])
        ),
      ];
    } else {
      to = [...new Set(Array.from(selectedRows).map((value) => value.phone))];
    }

    data = {
      ...data,
      content: data.content,
      to: to,
    };
    try {
      setPageState({ loading: true, success: "", error: "" });
      const res = await axios.post(
        `${BASE_URL}/send-message`,
        {
          ...data,
        },
        {
          withCredentials: true,
        }
      );
      if (res.status == 200) {
        setPageState({
          error: "",
          loading: true,
          success: "Messages Sent Successfully",
        });

        window.location.reload();
      } else {
        setPageState({
          error: "Something wrong happened",
          loading: false,
          success: "",
        });
        window.location.reload();
      }
    } catch (e) {
      setPageState({
        loading: false,
        success: "",
        error: e instanceof Error ? e.message : String(e),
      });
    }
  };

  return (
    <div>
      <Dialog>
        {" "}
        <DialogTrigger asChild className="cursor-pointer">
          <Button
            variant="outline"
            disabled={!active}
            className="bg-[#00e065] text-white hover:text-white hover:bg-[#125a32]"
          >
            Send Message
          </Button>
        </DialogTrigger>
        <DialogContent className=" flex flex-col items-center justify-between px-5 py-10">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center gap-5 min-w-[40%]">
                <label htmlFor="inhoud" className="">
                  inhoud:
                </label>
                <Textarea
                  {...register("content", {
                    required: "Content is required",
                    minLength: {
                      value: 10,
                      message: "Content must be at least 10 characters",
                    },
                  })}
                  id="inhoud"
                  className="max-w-[300px] max-h-[220px] text-lg font-medium"
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
              disabled={isDirty ? (pageState.loading ? true : false) : false}
              className={`self-center text-center mx-auto px-10 py-2 my-10 center flex justify-center cursor-pointer rounded-2xl text-xl ${
                isDirty
                  ? "bg-[#e4674b] hover:bg-[#d4563a]"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isDirty
                ? pageState.loading
                  ? "laden"
                  : "Änderungen speichern"
                : "keine Änderungen"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
