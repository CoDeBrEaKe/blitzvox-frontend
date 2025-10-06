"use client";
import { DataTableDemo } from "@/components/ui/table-app";
import { useState, useEffect } from "react";
import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { variableData } from "@/redux/type";
import { getClients } from "@/utils/api";
import Link from "next/link";

export default function Home() {
  const [filterOn, setFilterOn] = React.useState<string>("");
  const [filter, setFilter] = React.useState<string>("");
  const [clientsData, setClientsData] = React.useState({
    clients: [],
    pagination: {},
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNext: false,
    hasPrev: false,
  });

  const [showcase, setShowcase] = useState<Record<string, string>>({
    select: "select",
    first_name: "Name",
    email: "E-mail",
    phone: "Telefone",
    company_name: "Firma",
    city: "Stadt",
    subscriptions: "Verträge",
    feedbacks: "Letztes Feedback",
    actions: "actions",
  });

  const [clients, setClients] = useState<variableData[]>([]);

  // Fetch clients data
  const fetchClientsData = async (
    filterQuery: string = "",
    page: number = pagination.currentPage
  ) => {
    try {
      const clientsData = await getClients(filterQuery, {
        page: page,
        limit: pagination.itemsPerPage,
      });

      setClientsData(clientsData);
      setClients(clientsData.clients);

      // Update pagination with API response data
      if (clientsData.pagination) {
        setPagination((prev) => ({
          ...prev,
          currentPage: clientsData.pagination.currentPage || page,
          totalPages: clientsData.pagination.totalPages || 1,
          totalItems: clientsData.pagination.totalItems || 0,
          hasNext: clientsData.pagination.hasNext || false,
          hasPrev: clientsData.pagination.hasPrev || false,
        }));
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    fetchClientsData();
  }, []);

  // Refetch when page changes
  useEffect(() => {
    const filterQuery = filterOn && filter ? `${filterOn}${filter}` : "";
    fetchClientsData(filterQuery, pagination.currentPage);
  }, [pagination.currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: newPage,
      }));
    }
  };

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
        <h2>Kunden</h2>
        <div className="flex items-center py-4">
          <div className="flex gap-2">
            <form
              className="flex gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                let filteration = await getClients(`${filterOn}${filter}`, {
                  page: pagination.currentPage,
                  limit: 10,
                });
                setClients(filteration.clients);
                setPagination(filteration.pagination);
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
                className="cursor-pointer rounded-md border-1 px-2 py-1 font-medium text-sm"
                onChange={(e) => {
                  let v = (e as any).target.value;
                  if (v == "") {
                    setFilterOn("");
                    setFilter("");
                  }
                  setFilterOn(v);
                }}
              >
                <option value="" defaultChecked>
                  Filter
                </option>
                {Object.keys(showcase).map(
                  (key) =>
                    key != "select" &&
                    key != "feedbacks" &&
                    key != "actions" && (
                      <option
                        value={`${key}=`}
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
            <Link
              href={"/clients/create"}
              className="ml-auto text-sm text-center font-medium rounded-md flex px-3  items-center  cursor-pointer bg-emerald-800 hover:bg-emerald-800 text-white hover:text-white shadow"
            >
              {"Klant toevoegen"}
            </Link>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {Object.keys(showcase).map(
                (key) =>
                  key != "select" && (
                    <DropdownMenuCheckboxItem
                      key={key}
                      className="capitalize"
                      checked={showcase[key] != "" ? true : false}
                      onCheckedChange={() => toggleShowcase(key)}
                    >
                      {showcase[key]}
                    </DropdownMenuCheckboxItem>
                  )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <DataTableDemo data={clients} showcase={showcase} url={"clients"} />
        {/* Pagination Controls */}
        <span className="page-info text-sm text-[#888] block w-[100%] my-5 self-center text-center">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <div className="pagination flex gap-5 justify-center">
          <Button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrev}
          >
            Previous
          </Button>

          <Button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNext}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
