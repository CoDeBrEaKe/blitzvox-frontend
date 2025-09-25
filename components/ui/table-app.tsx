"use client";
import * as React from "react";
import { useEffect } from "react";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableDemoProps, variableData } from "@/redux/type";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DataTableDemo({
  data = [],
  showcase = [],
  columnVisibility = {},
  setColumnVisibility,
}: DataTableDemoProps) {
  // Flexible column visibility - can be any string keys

  useEffect(() => {
    if (showcase.length > 0) {
      const newVisibility: Record<string, boolean> = {};

      showcase.forEach((column) => {
        newVisibility[column] = true; // ✅ Correct syntax
      });

      setColumnVisibility({ select: true, ...newVisibility });
    }
  }, [showcase]);

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
              {columnVisibility.select && (
                <TableHead>
                  <Checkbox
                    checked={selectedRows.size === data.length}
                    onCheckedChange={toggleAllRows}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              {columnVisibility.status && <TableHead>Status</TableHead>}
              {columnVisibility.email && (
                <TableHead>
                  <Button variant="ghost" className="flex items-center gap-2">
                    Email
                    <ArrowUpDown />
                  </Button>
                </TableHead>
              )}
              {columnVisibility.amount && (
                <TableHead className="text-right">Amount</TableHead>
              )}
              {/* Dynamic columns from showcase */}
              {showcase.map(
                (column) =>
                  columnVisibility[column] && (
                    <TableHead key={column} className="capitalize">
                      {column}
                    </TableHead>
                  )
              )}
              {columnVisibility.actions && <TableHead />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length ? (
              data.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={selectedRows.has(row.id) ? "selected" : undefined}
                >
                  {columnVisibility.select && (
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(row.id)}
                        onCheckedChange={() => toggleRowSelection(row.id)}
                        aria-label="Select row"
                      />
                    </TableCell>
                  )}
                  {columnVisibility.status && (
                    <TableCell className="capitalize">{row.status}</TableCell>
                  )}
                  {columnVisibility.email && (
                    <TableCell className="lowercase">{row.email}</TableCell>
                  )}
                  {columnVisibility.amount && (
                    <TableCell className="text-right font-medium">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(row.amount)}
                    </TableCell>
                  )}
                  {/* Dynamic cells for showcase columns */}
                  {showcase.map(
                    (column) =>
                      columnVisibility[column] && (
                        <TableCell key={column}>
                          {/* You can customize what to display for each dynamic column */}
                          {column}
                        </TableCell>
                      )
                  )}
                  {columnVisibility.actions && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() =>
                              navigator.clipboard.writeText(row.id)
                            }
                          >
                            Copy payment ID
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View customer</DropdownMenuItem>
                          <DropdownMenuItem>
                            View payment details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={
                    Object.keys(columnVisibility).filter(
                      (key) => columnVisibility[key]
                    ).length
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
