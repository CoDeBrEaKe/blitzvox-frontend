"use client";
import { DataTableDemo } from "@/components/ui/table-app";
import { useState } from "react";
import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { variableData } from "@/redux/type";
export default function Home() {
  const [filterOn, setFilterOn] = React.useState<string>("");
  const [filter, setFilter] = React.useState<string>("");
  const [columnVisibility, setColumnVisibility] = React.useState<
    Record<string, boolean>
  >({
    name: true,
    age: true,
  });

  const [showcase, setShowcase] = useState([
    "Name",
    "E-mail",
    "Telefon",
    "Firma",
    "Stadt",
    "Verträge",
    "Letztes Feedback",
    "Aktionen",
  ]);
  const [clients, setClients] = useState([
    {
      name: "Mohamed",
      Email: "Date",
      Telefon: "Date",
      Firma: "Date",
      Stadt: "Date",
      Verträge: "Date",
      "Letztes Feedback": "Date",
      Aktionen: "Date",
    },
  ]);

  // Handle column visibility - now accepts any string
  const toggleColumnVisibility = (column: string): void => {
    setColumnVisibility((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };
  console.log(filter);
  return (
    <>
      <div className="px-4 text-2xl font-semibold">
        <h2>Clients</h2>
        <div className="flex items-center py-4">
          <form className="flex gap-2">
            <Input
              placeholder="Filter "
              value={filter}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFilter(event.target.value)
              }
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  {filterOn != "" ? filterOn : "Filter"} <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {Object.keys(columnVisibility)
                  .filter((key) => key !== "select" && key !== "actions")
                  .map((column) => (
                    <DropdownMenuItem
                      key={column}
                      className="capitalize"
                      onSelect={() => setFilterOn(column)}
                    >
                      {column}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" className="ml-auto">
              {filterOn != "" ? filterOn : "Filter"} <ChevronDown />
            </Button>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {Object.keys(columnVisibility)
                .filter((key) => key !== "select" && key !== "actions")
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column}
                    className="capitalize"
                    checked={columnVisibility[column]}
                    onCheckedChange={() => toggleColumnVisibility(column)}
                  >
                    {column}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <DataTableDemo
          data={clients}
          showcase={showcase}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
        />
      </div>
    </>
  );
}
