"use client";
import * as React from "react";
import { useEffect } from "react";
import { Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BASE_URL, DataTableDemoProps, variableData } from "@/redux/type";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAppSelector } from "@/redux/hooks";
import { getClientSubs } from "@/utils/api";

export function DataTableDemo({
  data,
  showcase,
  url,
  selectedRows,
  setSelectedRows,
  query,
}: DataTableDemoProps) {
  // Flexible column visibility - can be any string keys
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  // Handle row selection
  const toggleRowSelection = (row: variableData): void => {
    let newSelected = new Set(selectedRows);
    if (newSelected.has(row)) {
      newSelected.delete(row);
    } else {
      if (selectedRows!.size > 10) {
        newSelected = new Set([row]);
      }
      newSelected.add(row);
    }
    if (setSelectedRows) setSelectedRows(newSelected);
  };

  const toggleAllRows = async (): Promise<void> => {
    const res = await getClientSubs(query, { page: 1 });
    const clientSubs = res.clientSubs;
    if (setSelectedRows) {
      if (selectedRows?.size == clientSubs.length) {
        setSelectedRows(new Set());
      } else {
        let newset = clientSubs.map((row: variableData) => row);
        setSelectedRows(new Set(newset));
      }
    }
  };

  // Filter data by email
  return (
    <div className="w-full ">
      <div className="overflow-hidden rounded-md border px-4">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Dynamic columns from showcase */}
              <TableCell>
                <Checkbox
                  checked={
                    selectedRows ? selectedRows?.size > data.length : false
                  }
                  onCheckedChange={toggleAllRows}
                  aria-label="Select row"
                />
              </TableCell>
              {Object.keys(showcase).map(
                (column) =>
                  showcase[column] != "" && (
                    <TableHead
                      key={showcase[column]}
                      className="capitalize  !max-w-[100px] overflow-ellipsis"
                    >
                      {showcase[column]}
                    </TableHead>
                  )
              )}
              {showcase.actions && <TableHead />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length ? (
              data.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={selectedRows?.has(row) ? "selected" : undefined}
                  className="cursor-pointer"
                >
                  {showcase.select && (
                    <TableCell>
                      <Checkbox
                        checked={selectedRows?.has(row)}
                        onCheckedChange={() => toggleRowSelection(row)}
                        aria-label="Select row"
                      />
                    </TableCell>
                  )}

                  {Object.keys(showcase).map(
                    (key) =>
                      showcase[key] != "" &&
                      key != "select" &&
                      key != "actions" &&
                      (key == "first_name" ? (
                        <TableCell
                          key={showcase[key]}
                          onClick={() => router.push(`/${url}/${row.id}`)}
                        >
                          {/* You can customize what to display for each dynamic column */}
                          {row[key] == null
                            ? " "
                            : row[key] +
                              " " +
                              ((row as any)["family_name"] != null
                                ? (row as any)["family_name"]
                                : "")}
                        </TableCell>
                      ) : key == "subscriptions" ? (
                        <TableCell
                          key={showcase[key]}
                          onClick={() => router.push(`/${url}/${row.id}`)}
                        >
                          {row[key].map((sub: any) => (
                            <img
                              src={sub.type.sub_image}
                              className="w-6 h-6 inline-block mr-1"
                            />
                          ))}
                        </TableCell>
                      ) : key == "feedbacks" ? (
                        <TableCell
                          className="text-ellipsis max-w-[20px] whitespace-normal"
                          key={showcase[key]}
                          onClick={() => router.push(`/${url}/${row.id}`)}
                        >
                          {row[key].length
                            ? row[key][row[key]?.length - 1].feedback.slice(
                                0,
                                10
                              )
                            : ""}
                        </TableCell>
                      ) : (
                        <TableCell
                          key={showcase[key]}
                          onClick={() => router.push(`/${url}/${row.id}`)}
                        >
                          {row[key]}
                        </TableCell>
                      ))
                  )}
                  {showcase.actions && user?.role == "admin" && (
                    <TableCell>
                      <Button
                        className="bg-red-500 cursor-pointer"
                        key={row.id}
                        onClick={async () => {
                          try {
                            if (
                              confirm(
                                "Are you sure you want to delete this row?"
                              )
                            ) {
                              await axios.delete(
                                `${BASE_URL}/${url}/${row.id}`,
                                {
                                  withCredentials: true,
                                }
                              );
                              window.location.reload();
                            }
                          } catch (e) {
                            console.log(e);
                          }
                        }}
                        onSubmit={(e) => e.preventDefault()}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={
                    Object.keys(showcase).filter((key) => showcase[key]).length
                  }
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {selectedRows?.size} of{" "}
          {selectedRows && selectedRows!.size > data.length
            ? selectedRows!.size
            : data.length}{" "}
          row(s) selected.
        </div>
      </div>
    </div>
  );
}
