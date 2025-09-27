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
                {Object.keys(showcase).map((key) => (
                  <DropdownMenuItem
                    key={key}
                    className="capitalize"
                    onSelect={() => setFilterOn(key)}
                  >
                    {key}
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
              {Object.keys(showcase).map((key) => (
                <DropdownMenuCheckboxItem
                  key={key}
                  className="capitalize"
                  checked={showcase[key] != "" ? true : false}
                  onCheckedChange={() => toggleShowcase(key)}
                >
                  {key}
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
