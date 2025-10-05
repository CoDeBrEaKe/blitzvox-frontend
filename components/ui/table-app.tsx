"use client";
import * as React from "react";
import { useEffect } from "react";
import { Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BASE_URL, DataTableDemoProps } from "@/redux/type";

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

export function DataTableDemo({ data, showcase, url }: DataTableDemoProps) {
  // Flexible column visibility - can be any string keys
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(
    new Set()
  );

  // Handle row selection
  const toggleRowSelection = (id: string): void => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleAllRows = (): void => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map((row) => row.id)));
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
                  data-state={selectedRows.has(row.id) ? "selected" : undefined}
                  className="cursor-pointer"
                >
                  {showcase.select && (
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(row.id)}
                        onCheckedChange={() => toggleRowSelection(row.id)}
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
                          {row[key].map((sub: any) => sub.type.sub_image)}
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
          {selectedRows.size} of {data.length} row(s) selected.
        </div>
      </div>
    </div>
  );
}
