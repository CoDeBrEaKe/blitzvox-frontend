import React, { useState } from "react";
import { Dialog, DialogHeader, DialogContent } from "./dialog";
import { Input } from "./input";
import { Button } from "./button";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "@/redux/type";

interface form {
  csvfile: FileList;
}
const Form: React.FC = () => {
  const {
    register,
    formState: { isDirty },
    handleSubmit,
  } = useForm<form>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit: SubmitHandler<form> = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      formData.append("file", data.csvfile[0]);

      const res = await axios.post(`${BASE_URL}/import-file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      setSuccess(res.data.message);
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to upload file"
          : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
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
        <DialogHeader>Upload your CSV file</DialogHeader>
        <form
          encType="multipart/form-data"
          className="flex flex-col gap-10 items-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            type="file"
            accept=".csv"
            {...register("csvfile", { required: true })}
          />
          <Button type="submit" disabled={isLoading || !isDirty}>
            {isLoading ? "Uploading..." : "Import Data"}
          </Button>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Form;
