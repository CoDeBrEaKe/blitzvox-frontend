"use client";
import * as React from "react";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

// Static data
const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@example.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@example.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@example.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@example.com",
  },
];

// Type definition for Payment
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

// Type for column visibility state
type ColumnVisibility = {
  select: boolean;
  status: boolean;
  email: boolean;
  amount: boolean;
  actions: boolean;
};

// Type for sort configuration
type SortConfig = {
  key: keyof Payment | null;
  direction: "asc" | "desc" | null;
};

export function DataTableDemo() {
  const [emailFilter, setEmailFilter] = React.useState<string>("");
  const [columnVisibility, setColumnVisibility] = React.useState<
    Record<string, boolean>
  >({
    select: true,
    status: true,
    email: true,
    amount: true,
    actions: true,
  });

  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(
    new Set()
  );
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({
    key: null,
    direction: null,
  });

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
    if (selectedRows.size === filteredData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredData.map((row) => row.id)));
    }
  };

  // Handle sorting
  const handleSort = (key: keyof Payment): void => {
    setSortConfig((prev) => {
      if (prev.key === key && prev.direction === "asc") {
        return { key, direction: "desc" };
      }
      return { key, direction: "asc" };
    });
  };

  // Handle column visibility
  const toggleColumnVisibility = (column: keyof ColumnVisibility): void => {
    setColumnVisibility((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  // Filter data by email
  const filteredData: Payment[] = data.filter((row) =>
    row.email.toLowerCase().includes(emailFilter.toLowerCase())
  );

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  return (
    <div className="w-full px-4">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={emailFilter}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setEmailFilter(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Object.keys(columnVisibility)
              .filter((key) => key !== "select" && key !== "actions")
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column}
                  className="capitalize"
                  checked={columnVisibility[column as keyof ColumnVisibility]}
                  onCheckedChange={() =>
                    toggleColumnVisibility(column as keyof ColumnVisibility)
                  }
                >
                  {column}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border px-4">
        <Table>
          <TableHeader>
            <TableRow>
              {columnVisibility.select && (
                <TableHead>
                  <Checkbox
                    checked={selectedRows.size === filteredData.length}
                    onCheckedChange={toggleAllRows}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              {columnVisibility.status && <TableHead>Status</TableHead>}
              {columnVisibility.email && (
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("email")}
                    className="flex items-center gap-2"
                  >
                    Email
                    <ArrowUpDown />
                  </Button>
                </TableHead>
              )}
              {columnVisibility.amount && (
                <TableHead className="text-right">Amount</TableHead>
              )}
              {columnVisibility.actions && <TableHead />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length ? (
              sortedData.map((row) => (
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
                <TableCell colSpan={5} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {selectedRows.size} of {filteredData.length} row(s) selected.
        </div>
      </div>
    </div>
  );
}
