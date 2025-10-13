import { SetStateAction } from "react";

export const LOGIN = "LOGIN";
export const BASE_URL =
  process.env.NODE_ENV == "development"
    ? "http://127.0.0.1:3000"
    : process.env.NEXT_PUBLIC_API_BASE_URL;
export interface variableData {
  [key: string]: any;
}

export interface requestData {}
export interface DataTableDemoProps {
  data: variableData[];
  showcase: Record<string, string>;
  url: string;
  selectedRows?: Set<variableData>;
  query?: string;
  setSelectedRows?: (selected: Set<variableData>) => void;
}

export interface paginationType {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}
