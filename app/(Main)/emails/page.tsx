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
import { ChevronDown } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { variableData } from "@/redux/type";
import { getEmails, getSubscriptionTypes, getUsers } from "@/utils/api";
import { useAppSelector } from "@/redux/hooks";

export default function Home() {
  const { user } = useAppSelector((state) => state.auth);
  const [filterOn, setFilterOn] = React.useState<string>("");
  const [filter, setFilter] = React.useState<string>("");

  const [filterShow, setFilterShow] = useState<Record<string, string>>({
    subject: "E-mailonderwerp",
    content: "E-mailinhoud",
    actions: "actions",
  });
  const [showcase, setShowcase] = useState<Record<string, string>>({
    subject: "E-mailonderwerp",
    content: "E-mailinhoud",
    actions: "actions",
  });
  const [emails, setEmails] = useState<variableData[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNext: false,
    hasPrev: false,
  });
  const [emailsData, setEmailsData] = useState<variableData[]>([]);

  const fetchEmailData = async (
    filterQuery: string = "",
    page: number = pagination.currentPage
  ) => {
    const res = await getEmails(filterQuery, {
      page: page,
      limit: 10,
    });
    setEmails(res.emails);

    setEmailsData(res);
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
    fetchEmailData();
  }, []);

  useEffect(() => {
    const filterQuery = filterOn && filter ? `${filterOn}${filter}` : "";
    fetchEmailData(filterQuery, pagination.currentPage);
  }, [pagination.currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
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
        <h2>Users</h2>
        <div className="flex items-center py-4">
          <div className="flex gap-2">
            <form
              className="flex gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                let filteration = await getEmails(`${filterOn}${filter}`);
                setEmails(filteration.emails);
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
            {user && user?.role == "admin" ? (
              <Link
                href={"/emails/create"}
                className="ml-auto text-sm text-center font-medium rounded-md flex px-3  items-center  cursor-pointer bg-emerald-800 hover:bg-emerald-800 text-white hover:text-white shadow"
              >
                {"E-mail maken"}
              </Link>
            ) : (
              ""
            )}
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
        <DataTableDemo data={emails} showcase={filterShow} url={"emails"} />
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
