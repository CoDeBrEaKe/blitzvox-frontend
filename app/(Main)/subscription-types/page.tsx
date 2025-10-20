"use client";
import { DataTableDemo } from "@/components/ui/table-app";
import { useState, useEffect } from "react";
import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BASE_URL, variableData } from "@/redux/type";
import { getSubscriptionTypes } from "@/utils/api";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";

export default function Home() {
  const [filterOn, setFilterOn] = React.useState<string>("");
  const [filter, setFilter] = React.useState<string>("");
  const [filterShow, setFilterShow] = useState<Record<string, string>>({
    sub_type: "abonnementstype",
    sub_image: "abonnementsafbeelding",
  });
  const [showcase, setShowcase] = useState<Record<string, string>>({
    sub_type: "abonnementstype",
    sub_image: "abonnementsafbeelding",
  });
  const [subscriptiontypes, setSubscriptiontypes] = useState<variableData[]>(
    []
  );
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNext: false,
    hasPrev: false,
  });
  const [subscriptionsData, setSubscriptionsData] = useState<variableData[]>(
    []
  );
  const router = useRouter();

  const fetchSubscriptionData = async (
    filterQuery: string = "",
    page: number = pagination.currentPage
  ) => {
    const res = await getSubscriptionTypes(filterQuery, {
      page: page,
      limit: 10,
    });
    setSubscriptiontypes(res.types);

    setSubscriptionsData(res);
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
    fetchSubscriptionData();
  }, []);

  useEffect(() => {
    const filterQuery = filterOn && filter ? `${filterOn}${filter}` : "";
    fetchSubscriptionData(filterQuery, pagination.currentPage);
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
    setFilterShow((prev) => {
      const newObj =
        prev[column] === ""
          ? { ...prev, [column]: showcase[column] }
          : { ...prev, [column]: "" };

      return newObj;
    });
  };

  return (
    <>
      <div className="text-2xl font-semibold  p-5  rounded-md bg-white m-3">
        <h2>abonnementen</h2>
        <div className="flex items-center py-4">
          <div className="flex gap-2">
            <form
              className="flex gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                let filteration = await getSubscriptionTypes(
                  `${filterOn}${filter}`
                );
                setSubscriptiontypes(filteration.types);
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
              href={"/subscription-types/create"}
              className="ml-auto text-sm text-center font-medium rounded-md flex px-3  items-center  cursor-pointer bg-emerald-800 hover:bg-emerald-800 text-white hover:text-white shadow"
            >
              {"Abonnementstype aanmaken"}
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
              {subscriptiontypes.length > 0 ? (
                subscriptiontypes.map((type) => (
                  <TableRow
                    className="cursor-pointer hover:bg-gray-200"
                    key={type.id}
                  >
                    <TableCell
                      onClick={() =>
                        router.push(`/subscription-types/${type.id}`)
                      }
                    >
                      {type["sub_type"]}
                    </TableCell>
                    <TableCell
                      onClick={() =>
                        router.push(`/subscription-types/${type.id}`)
                      }
                    >
                      <img
                        src={type["sub_image"]}
                        className="flex self-center"
                      />
                    </TableCell>

                    <TableCell>
                      <Button
                        className="bg-red-500 cursor-pointer"
                        onClick={async () => {
                          if (
                            confirm("Are you sure you want to delete this row?")
                          ) {
                            try {
                              const res = await axios.delete(
                                `${BASE_URL}/subscription-types/${type.id}`,
                                { withCredentials: true }
                              );
                              if (res.status == 200) window.location.reload();
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
    </>
  );
}
