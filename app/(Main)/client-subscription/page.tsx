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
import { getClientSubs } from "@/utils/api";
import { EmailModal } from "@/components/ui/emailModal";

export default function Home() {
  const [filterOn, setFilterOn] = React.useState<string>("");
  const [filter, setFilter] = React.useState<string>("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 10,
    totalItems: 0,
    itemsPerPage: 10,
    hasNext: false,
    hasPrev: false,
  });
  const [filterShow, setfilterShow] = useState<Record<string, string>>({
    "client.first_name": "Name",
    your_order_num: "Ihre Auftr.-Nr.",
    sign_date: "Unterschriftsdatum",
    "subscription.sub_name": "Tarif/Produkt",
    counter_number: "Zählernummer",
    start_importing: "Lieferbeginn",
    end_importing: "Endlieferdatum",
    "subscription.type.sub_image": "Verträge",
    actions: "actions",
  });
  const [showcase, setShowcase] = useState<Record<string, string>>({
    select: "",
    "client.first_name": "Name",
    your_order_num: "Ihre Auftr.-Nr.",
    "subscription.sub_name": "Tarif/Produkt",
    counter_number: "Zählernummer",
    sign_date: "Unterschriftsdatum",
    start_importing: "Lieferbeginn",
    end_importing: "Endlieferdatum",
    "subscription.type.sub_image": "Verträge",
    actions: "actions",
  });
  const [clientSubsData, setClientsSubsData] = useState<variableData[]>([]);
  const [clientSubs, setClientsSubs] = useState<variableData[]>([]);
  const [active, setActive] = React.useState<boolean>(false);
  const [selectedRows, setSelectedRows] = React.useState<Set<variableData>>(
    new Set()
  );
  const fetchClientSubsData = async (
    filterQuery: string = "",
    page: number = pagination.currentPage
  ) => {
    const res = await getClientSubs(filterQuery, {
      page: page,
      limit: 10,
      // from: "",
      // to: "",
    });
    setClientsSubs(res.clientSubs);

    setClientsSubsData(res);
    if (res.pagination) {
      setPagination((prev) => ({
        ...prev,
        currentPage: res.pagination.currentPage || page,
        totalPages: res.pagination.totalPages || 1,
        totalItems: res.pagination.totalItems || 0,
        hasNext: res.pagination.hasNext || false,
        hasPrev: res.pagination.hasPrev || false,
      }));
    }
  };
  useEffect(() => {
    fetchClientSubsData();
  }, []);

  useEffect(() => {
    const filterQuery = filterOn && filter ? `${filterOn}${filter}` : "";
    fetchClientSubsData(filterQuery, pagination.currentPage);
  }, [pagination.currentPage]);

  const handleSelection = (newSelection: Set<variableData>) => {
    setSelectedRows(newSelection);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: newPage,
      }));
    }
  };
  const toggleShowcase = (column: string) => {
    setfilterShow((prev) => {
      const newObj =
        prev[column] === ""
          ? { ...prev, [column]: showcase[column] }
          : { ...prev, [column]: "" };

      return newObj;
    });
  };

  useEffect(() => {
    if (Array.from(selectedRows).length) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [selectedRows]);
  return (
    <>
      <div className="px-4 text-2xl font-semibold">
        <h2>cliëntabonnementen</h2>
        <div className="flex items-center py-4">
          <div className="flex gap-2">
            <form
              className="flex gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                let filteration = await getClientSubs(`${filterOn}${filter}`);
                setClientsSubs(filteration.clientSubs);
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
                <option value="" disabled defaultChecked>
                  Filter
                </option>
                {Object.keys(showcase).map(
                  (key) =>
                    key != "select" &&
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
            <EmailModal
              active={active}
              selectedRows={selectedRows}
              page="clientSub"
            ></EmailModal>
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
                      checked={filterShow[key] != "" ? true : false}
                      onCheckedChange={() => toggleShowcase(key)}
                    >
                      {showcase[key]}
                    </DropdownMenuCheckboxItem>
                  )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <DataTableDemo
          data={clientSubs}
          showcase={filterShow}
          url={"client-subscription"}
          selectedRows={selectedRows}
          setSelectedRows={handleSelection}
          query={filterOn && filter ? `${filterOn}${filter}` : ""}
        />
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
