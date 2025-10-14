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

export function DataTableDemo({ data, showcase, url }: DataTableDemoProps) {
  // Flexible column visibility - can be any string keys
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  // Filter data by email
  return (
    <div className=" ">
      <div className="overflow-hidden rounded-md border px-4">
        <Table>
          <TableHeader>
            <TableRow>
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
                <TableRow key={row.id} className="cursor-pointer">
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
                      ) : key == "subscription.type.sub_image" ? (
                        <TableCell
                          key={row["subscription.type.sub_image"]}
                          onClick={() => router.push(`/${url}/${row.id}`)}
                        >
                          <img
                            src={row[key]}
                            className="w-6 h-6 inline-block mr-1"
                          />
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
          {data.length} row(s)
        </div>
      </div>
    </div>
  );
}
