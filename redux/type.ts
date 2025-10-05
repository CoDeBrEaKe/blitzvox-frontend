import { SetStateAction } from "react";

export const LOGIN = "LOGIN";
export const BASE_URL = "http://127.0.0.1:3000";
export interface variableData {
  [key: string]: any;
}

export interface requestData {}
export interface DataTableDemoProps {
  data: variableData[];
  showcase: Record<string, string>;
  url: string;
}

export interface paginationType {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}
