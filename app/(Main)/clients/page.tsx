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

import { BASE_URL, variableData } from "@/redux/type";
import { getClients, getSubscriptions } from "@/utils/api";
import Link from "next/link";
import { EmailModal } from "@/components/ui/emailModal";
import Form from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { WhatsappModal } from "@/components/ui/whatsappModal";
export default function Home() {
  const [active, setActive] = React.useState<boolean>(false);
  const [selectedRows, setSelectedRows] = React.useState<Set<variableData>>(
    new Set()
  );
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

  const [filterShow, setFilterShow] = useState<Record<string, string>>({
    first_name: "Name",
    email: "E-mail",
    phone: "Telefone",
    city: "Stadt",
    subscriptions: "Verträge",
    feedbacks: "Letztes Feedback",
  });

  const [showcase, setShowcase] = useState<Record<string, string>>({
    select: "",
    first_name: "Name",
    email: "E-mail",
    phone: "Telefone",
    city: "Stadt",
    subscriptions: "Verträge",
    feedbacks: "Letztes Feedback",
  });

  const [clients, setClients] = useState<variableData[]>([]);
  const router = useRouter();
  // Fetch clients data
  const fetchClientsData = async (
    filterQuery: string = "",
    page: number = pagination.currentPage,
    limit?: number | undefined
  ) => {
    try {
      const clientsData = await getClients(filterQuery, {
        page: page,
        limit: limit,
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
    return clientsData;
  };

  useEffect(() => {
    fetchClientsData("", 1, 10);
  }, []);

  // Refetch when page changes
  useEffect(() => {
    const filterQuery = filterOn && filter ? `${filterOn}${filter}` : "";
    fetchClientsData(filterQuery, pagination.currentPage, 10);
  }, [pagination.currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: newPage,
      }));
    }
  };
  const toggleAllSelection = async () => {
    const filterQuery = filterOn && filter ? `${filterOn}${filter}` : "";
    const res = await fetchClientsData(filterQuery, 1, undefined);
    setClients(res.clients);

    if (selectedRows.size === clients.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(res.clients));
    }
  };
  useEffect(() => {
    if (Array.from(selectedRows).length) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [selectedRows]);

  const toggleShowcase = (column: string) => {
    setFilterShow((prev) => {
      const newObj =
        prev[column] === ""
          ? { ...prev, [column]: showcase[column] }
          : { ...prev, [column]: "" };

      return newObj;
    });
  };

  return (
    <div className=" text-2xl font-semibold  p-5  rounded-md bg-white m-3 ">
      <h2>Kunden</h2>
      <div className="flex items-center py-4">
        <div className="flex gap-2">
          <form
            className="flex gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              let filteration = await fetchClientsData(
                `${filterOn}${filter}`,
                1,
                10
              );
              setClients(filteration.clients);
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
                      key={filterShow[key]}
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
        <div className="mx-2 flex gap-1">
          <EmailModal active={active} selectedRows={selectedRows}></EmailModal>
          <WhatsappModal
            active={active}
            selectedRows={selectedRows}
          ></WhatsappModal>
          <div></div>
        </div>

        <div>
          <Form />
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
      <div className="border rounded-md p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={clients.length == selectedRows?.size}
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
              <TableCell className="font-bold">actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length > 0 ? (
              clients.map((client) => (
                <TableRow
                  className="cursor-pointer hover:bg-gray-200"
                  key={client.id}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(client)}
                      onCheckedChange={(checked) => {
                        const newSelected = new Set(selectedRows);
                        if (checked) newSelected.add(client);
                        else newSelected.delete(client);
                        setSelectedRows(newSelected);
                      }}
                    />
                  </TableCell>
                  {Object.keys(filterShow).map((key) =>
                    filterShow[key] ? (
                      <TableCell
                        key={`${client.id}-${key}`} // ✅ FIX HERE
                        onClick={() => router.push(`/clients/${client.id}`)}
                      >
                        {filterShow[key] == "Name"
                          ? `${client["first_name"]} ${client["family_name"]}`
                          : key != "subscriptions" && key != "feedbacks"
                          ? client[key]
                          : key == "subscriptions"
                          ? client["subscriptions"].map((sub: any) => (
                              <img
                                onClick={() =>
                                  router.push(`/client-subscription/${sub.id}`)
                                }
                                src={sub.type.sub_image}
                                className="w-6 h-6 inline-block mr-1"
                              />
                            ))
                          : client["feedbacks"].length > 0 &&
                            client["feedbacks"][client["feedbacks"].length - 1]
                              .feedback}
                      </TableCell>
                    ) : null
                  )}

                  <TableCell>
                    <Button
                      className="bg-red-500 cursor-pointer"
                      onClick={async () => {
                        if (
                          confirm("Are you sure you want to delete this row?")
                        ) {
                          try {
                            await axios.delete(
                              `${BASE_URL}/clients/${client.id}`,
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
  );
}
