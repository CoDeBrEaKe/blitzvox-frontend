import React from "react";
import { Dialog, DialogHeader, DialogContent } from "./dialog";
import { Input } from "./input";
import { Button } from "./button";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "@/redux/type";

interface form {
  csvfile: File;
}
const Form: React.FC = () => {
  const {
    register,
    formState: { isDirty },
    handleSubmit,
  } = useForm<form>();

  const onSubmit: SubmitHandler<form> = async (data) => {
    const res = axios.post(`${BASE_URL}/import-file`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild className="cursor-pointer">
        <Button
          variant="outline"
          className="bg-[#00A1E0] text-white hover:text-[#00A1E0] hover:bg-white"
        >
          Import Data
        </Button>
      </DialogTrigger>
      <DialogContent>
        Upload your csv file
        <form
          encType="multipart/form-data"
          className="flex flex-col gap-10 items-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input type="file" />
          <Button>Import Data</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Form;
