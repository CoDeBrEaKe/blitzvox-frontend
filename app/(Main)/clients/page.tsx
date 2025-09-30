"use client";
import { DataTableDemo } from "@/components/ui/table-app";
import { useState, useEffect } from "react";
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
import { getClients } from "@/utils/api";

export default function Home() {
  const [filterOn, setFilterOn] = React.useState<string>("");
  const [filter, setFilter] = React.useState<string>("");

  const [showcase, setShowcase] = useState<Record<string, string>>({
    select: "select",
    first_name: "Name",
    email: "E-mail",
    phone: "Telefone",
    company_name: "Firma",
    city: "Stadt",
    subscriptions: "Verträge",
    actions: "actions",
  });
  const [clients, setClients] = useState<variableData[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      const clientsData = await getClients();
      setClients([...clientsData]);
    };
    fetchClients();
  }, []);

  const toggleShowcase = (column: string) => {
    setShowcase((prev) => {
      const newObj =
        prev[column] === ""
          ? { ...prev, [column]: column }
          : { ...prev, [column]: "" };

      return newObj;
    });
  };

  return (
    <>
      <div className="px-4 text-2xl font-semibold">
        <h2>Clients</h2>
        <div className="flex items-center py-4">
          <form
            className="flex gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              let filteration = await getClients(`?${filterOn}=${filter}`);
              setClients(filteration);
            }}
          >
            <Input
              placeholder="Filter "
              value={filter}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFilter(event.target.value)
              }
              className="max-w-sm"
            />

            <select
              name="filterOn"
              id="filterOn"
              className=" rounded-md border-1 px-2 py-1 font-medium text-sm"
              aria-placeholder="ksoha"
              onChange={(e) => {
                setFilterOn((e as any).target.value);
              }}
            >
              {Object.keys(showcase).map(
                (key) =>
                  key != "select" &&
                  key != "actions" && (
                    <option
                      value={key}
                      key={showcase[key]}
                      className="capitalize"
                      onSelect={(e) => setFilterOn(key)}
                    >
                      {showcase[key]}
                    </option>
                  )
              )}
            </select>

            <Button
              variant="outline"
              className="ml-auto cursor-pointer hover:bg-blue-500 hover:text-white"
            >
              {"Filter"}
            </Button>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {Object.keys(showcase).map((key) => (
                <DropdownMenuCheckboxItem
                  key={key}
                  className="capitalize"
                  checked={showcase[key] != "" ? true : false}
                  onCheckedChange={() => toggleShowcase(key)}
                >
                  {showcase[key]}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <DataTableDemo data={clients} showcase={showcase} url={"clients"} />
      </div>
    </>
  );
}
