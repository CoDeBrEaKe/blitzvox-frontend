import React, { useState } from "react";
import { Dialog, DialogHeader, DialogContent } from "./dialog";
import { Input } from "./input";
import { Button } from "./button";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "@/redux/type";

interface FormData {
  csvfile: FileList;
}

interface ResultItem {
  error?: string;
  row: {
    "Ihre Auftr.-Nr.": string;
    [key: string]: any;
  };
}

const Form: React.FC = () => {
  const {
    register,
    formState: { isDirty },
    handleSubmit,
  } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const downloadResultsFile = (results: ResultItem[]) => {
    // Create CSV content with two columns: Order Number and Error
    const csvContent = [
      ["Order Number", "Error"], // Header
      ...results.map((result) => [
        result.row["Vorname"] || "",
        result.row["Nachname"] || "",
        result.row["Auftr.-Nr."] || "",
        result.row["Zählernummer"] || "",
        result.row["Verbrauch"] || "",
        result.error || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    // Create blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "import_results.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
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

      // Download results file instead of setting state
      if (res.data.results && res.data.results.length > 0) {
        downloadResultsFile(res.data.results);
      }
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
