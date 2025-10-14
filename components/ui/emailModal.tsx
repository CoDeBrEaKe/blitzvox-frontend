import React, { useEffect, useRef, useState } from "react";
import { DialogContent, DialogTrigger, Dialog } from "./dialog";
import { Button } from "./button";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "./textarea";
import { Input } from "./input";
import { BASE_URL, variableData } from "@/redux/type";
import { getEmails } from "@/utils/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
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

export const EmailModal: React.FC<ChildProps> = ({
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
  const {
    register: registerTemplate,
    handleSubmit: handleSubmitTemplate,
    reset: resetTemplate,
    setValue: setTempValue,
    formState: { errors: templateErrors, isDirty: templateDirty },
  } = useForm<FormInputs>({
    mode: "onChange",
    defaultValues: { subject: "", content: "" },
  });

  const [pageState, setPageState] = useState({
    error: "",
    success: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [emails, setEmails] = useState<variableData[]>([]);
  let email = useRef<EventTarget>(null);
  if (page == "clientSub") {
    const to = Array.from(selectedRows).map((value) => value["client.email"]);
  }

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    let to;
    if (page == "clientSub") {
      to = [
        ...new Set(
          Array.from(selectedRows).map((value) => value["client.email"])
        ),
      ];
    } else {
      to = [...new Set(Array.from(selectedRows).map((value) => value.email))];
    }
    data = {
      ...data,
      subject: data.subject,
      content: data.content,
      to: to,
    };
    try {
      const res = await axios.post(
        `${BASE_URL}/send-email`,
        {
          ...data,
          //  array of clients id
        },
        {
          withCredentials: true,
        }
      );
      setPageState((prev) => {
        return { ...prev, success: "Emails Sent Successfully" };
      });
      window.location.reload();
    } catch (e) {
      setPageState((prev) => {
        return {
          ...prev,
          success: "",
          error: e instanceof Error ? e.message : String(e),
        };
      });
    }
  };

  const onSubmitTemplate: SubmitHandler<FormInputs> = async (data) => {
    const selectedEmail =
      emails[emails.findIndex((e) => e.id == (email as any)?.current?.id)];
    let to;
    if (page == "clientSub") {
      to = Array.from(selectedRows).map((value) => value["client.email"]);
    } else {
      to = Array.from(selectedRows).map((value) => value.email);
    }
    data = {
      ...data,
      subject: selectedEmail.subject,
      content: selectedEmail.content,
      to: to,
    };

    try {
      const res = await axios.post(
        `${BASE_URL}/send-email`,
        {
          ...data,
          //  array of clients id
        },
        {
          withCredentials: true,
        }
      );
      setPageState((prev) => {
        return { ...prev, success: "Emails Sent Successfully" };
      });
      window.location.reload();
    } catch (e) {
      setPageState((prev) => {
        return { ...prev, error: e instanceof Error ? e.message : String(e) };
      });
    }
  };

  useEffect(() => {
    const loadEmails = async () => {
      try {
        const req = await getEmails();
        setEmails(req.emails);
      } catch (e) {
        setPageState((prev) => {
          return {
            ...prev,
            errors: e,
          };
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadEmails();
  }, []);

  const choiceHandler = (e: React.MouseEvent) => {
    email.current = (e as any).target.parentElement;
    console.log(email.current);
    setTempValue("subject", e.currentTarget.innerHTML, { shouldDirty: true });
    Array.from((email as any).current.parentNode.children).forEach(
      (element: any) => {
        element.classList.remove("bg-emerald-100");
      }
    );

    (email as any).current.classList.add("bg-emerald-100");
  };
  return (
    <div>
      <Dialog>
        {" "}
        <DialogTrigger asChild className="cursor-pointer">
          <Button
            variant="outline"
            disabled={!active}
            className="bg-[#00A1E0] text-white hover:text-[#00A1E0] hover:bg-white"
          >
            Send Email
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[725px]">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl font-semibold cursor-pointer">
                Choose from Templates
              </AccordionTrigger>
              <AccordionContent>
                <form
                  onSubmit={handleSubmitTemplate(onSubmitTemplate)}
                  className="flex flex-col items-center gap-6"
                >
                  <Table className=" overflow-hidden">
                    <TableHeader>
                      <TableRow>
                        <TableHead> E-mailonderwerp</TableHead>
                        <TableHead>E-mailinhoud </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="overflow-hidden max-w-10">
                      {emails.map((one) => (
                        <TableRow
                          id={one.id}
                          key={one.id}
                          className="cursor-pointer overflow-hidden max-w-30  hover:bg-emerald-100"
                          onClick={(e) => choiceHandler(e)}
                        >
                          <TableCell className="overflow-hidden">
                            {one.subject}
                          </TableCell>
                          <TableCell
                            width={2}
                            className="overflow-hidden max-w-[250px]"
                          >
                            {one.content}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

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

                  <Button disabled={!templateDirty} className="px-6 py-4">
                    Send
                  </Button>
                </form>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>New Email</AccordionTrigger>
              <AccordionContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <h1 className="text-xl md:text-2xl font-semibold mb-10">
                    abonnement:
                  </h1>
                  <div className="flex flex-col gap-8">
                    <div className="flex justify-between items-center gap-5 min-w-[40%]">
                      <label htmlFor="subject" className="flex-1">
                        onderwerp:
                      </label>
                      <Input
                        {...register("subject", {
                          required: "Subject is required",
                          minLength: {
                            value: 2,
                            message: "Subject must be at least 2 characters",
                          },
                        })}
                        id="subject"
                        className="max-w-[350px] text-lg font-medium"
                      />
                    </div>

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
                        className="max-w-[350px] max-h-[220px] text-lg font-medium"
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DialogContent>
      </Dialog>
    </div>
  );
};
