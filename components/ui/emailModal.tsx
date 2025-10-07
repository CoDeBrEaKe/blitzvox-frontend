import React, {
  ReactElement,
  ReactEventHandler,
  ReactHTMLElement,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { DataTableDemo } from "./table-app";
import { variableData } from "@/redux/type";
import { getEmails } from "@/utils/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
interface FormInputs {
  subject: string;
  content: string;
}
export const EmailModal = ({
  active,
}: React.ComponentProps<"div"> & { active: boolean }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormInputs>();

  const [showcase, setShowcase] = useState<Record<string, string>>({
    subject: "E-mailonderwerp",
    content: "E-mailinhoud",
  });
  const [pageState, setPageState] = useState({
    error: "",
    success: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [emails, setEmails] = useState<variableData[]>([]);
  let email = useRef<EventTarget>(null);
  const onSubmit: SubmitHandler<FormInputs> = (data) => {};

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
        <DialogTrigger asChild>
          <Button variant="outline">Send Email</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[725px]">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl font-semibold cursor-pointer">
                Choose from Templates
              </AccordionTrigger>
              <AccordionContent>
                <form
                  onSubmit={handleSubmit(onSubmit)}
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
                  <Button className="px-6 py-4" disabled>
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
                  <div className="flex flex-col md:flex md:flex-col md:gap-10 md:items-center ">
                    <div className="flex justify-between items-center gap-5 min-w-[40%]">
                      <label htmlFor="subject" className="flex-1">
                        onderwerp:
                      </label>
                      <Input
                        {...register("subject")}
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
