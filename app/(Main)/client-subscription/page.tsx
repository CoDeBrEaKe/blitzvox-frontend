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
import { ArrowUpDown, Check, ChevronDown, MoreHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { BASE_URL, variableData } from "@/redux/type";
import { getClientSubs } from "@/utils/api";
import { EmailModal } from "@/components/ui/emailModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

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
  });
  const [showcase, setShowcase] = useState<Record<string, string>>({
    select: "",
    "client.first_name": "Name",
    your_order_num: "Ihre Auftr.-Nr.",
    "subscription.sub_name": "Tarif/Produkt",
    counter_number: "Zählernummer",
  });
  const [dateOn, setDateOn] = useState<string>("sign_date");
  const [dates, setDates] = useState<string[]>([]);
  const [clientSubsData, setClientsSubsData] = useState<variableData[]>([]);
  const [clientSubs, setClientsSubs] = useState<variableData[]>([]);
  const [active, setActive] = React.useState<boolean>(false);
  const [selectedRows, setSelectedRows] = React.useState<Set<variableData>>(
    new Set()
  );
  const router = useRouter();

  const { user } = useAppSelector((state) => state.auth);
  const fetchClientSubsData = async (
    filterQuery: string = "",
    page: number = pagination.currentPage
  ) => {
    const res = await getClientSubs(filterQuery, {
      page: page,
      limit: 10,
      date: {
        sign_date: [],
      },
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

  const toggleAllSelection = async () => {
    const filterQuery = filterOn && filter ? `${filterOn}${filter}` : "";
    const res = await getClientSubs(filterQuery, {
      page: 1,
      limit: undefined,
      date: dateOn
        ? { dateOn: dates }
        : ["1900-06-04", new Date().toISOString()],
    });
    setClientsSubs(res.clientSubs);

    if (selectedRows.size === clientSubs.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(res.clientSubs));
    }
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
      <div className="text-2xl font-semibold  p-5  rounded-md bg-white m-3">
        <h2>cliëntabonnementen</h2>
        <div className="flex items-center py-4">
          <div className="flex gap-2">
            <form
              className="flex gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                let filteration = await getClientSubs(`${filterOn}${filter}`, {
                  page: pagination.currentPage,
                  limit: 10,
                  date: { [dateOn]: dates },
                });
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
                <option value="" disabled selected>
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
              <Input
                type="date"
                className="cursor-pointer rounded-md border-1 px-2 py-1 font-medium text-sm"
                onChange={(e) => {
                  setDates((prev) => [e.target.value, prev[1]]);
                }}
              />
              <Input
                type="date"
                name="to"
                className="cursor-pointer rounded-md border-1 px-2 py-1 font-medium text-sm"
                onChange={(e) => setDates((prev) => [prev[0], e.target.value])}
              />
              <select
                name="dateFilter"
                id="dateFilter"
                className="cursor-pointer rounded-md border-1 px-2 py-1 font-medium text-sm"
                onChange={(e) => {
                  setDateOn(e.target.value);
                }}
              >
                <option value="sign_date" selected>
                  Unterschriftsdatum
                </option>
                <option value="start_importing">Lieferbeginn</option>
                <option value="end_importing">Endlieferdatum</option>
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

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={clientSubs.length == selectedRows?.size}
                    onCheckedChange={toggleAllSelection}
                    aria-label="Select all rows"
                  />
                </TableCell>
                {Object.keys(filterShow).map(
                  (key) =>
                    filterShow[key] != "" && (
                      <TableCell key={key} className="font-bold">
                        <div className="flex items-center gap-2">
                          {filterShow[key]}
                        </div>
                      </TableCell>
                    )
                )}
                {user?.role == "admin" && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientSubs.length > 0 ? (
                clientSubs.map((sub) => (
                  <TableRow
                    className="cursor-pointer hover:bg-gray-200"
                    key={sub.id}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(sub)}
                        onCheckedChange={(checked) => {
                          const newSelected = new Set(selectedRows);
                          if (checked) newSelected.add(sub);
                          else newSelected.delete(sub);
                          setSelectedRows(newSelected);
                        }}
                      />
                    </TableCell>
                    {Object.keys(filterShow).map((key) =>
                      key != "subscription.type.sub_image" ? (
                        filterShow[key] && (
                          <TableCell
                            onClick={() =>
                              router.push(`/client-subscription/${sub.id}`)
                            }
                          >
                            {sub[key]}
                          </TableCell>
                        )
                      ) : (
                        <TableCell
                          onClick={() =>
                            router.push(`/client-subscription/${sub.id}`)
                          }
                        >
                          <img
                            src={sub["subscription.type.sub_image"]}
                            className="flex self-center"
                          />
                        </TableCell>
                      )
                    )}
                    {user?.role == "admin" && (
                      <TableCell>
                        <Button
                          className="bg-red-500 cursor-pointer"
                          onClick={async () => {
                            if (
                              confirm(
                                "Are you sure you want to delete this row?"
                              )
                            ) {
                              try {
                                await axios.delete(
                                  `${BASE_URL}/client-subscription/${sub.id}`,
                                  { withCredentials: true }
                                );
                                window.location.reload();
                              } catch (e) {
                                console.error(e);
                              }
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-gray-500">
                    No client subscriptions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div>
          <div className="text-muted-foreground flex-1 text-sm">
            {clientSubs.length} row(s)
          </div>
          <span className="page-info text-sm text-[#888] block w-[100%] my-5 self-center text-center">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
        </div>
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
