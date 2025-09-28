import { BASE_URL } from "@/redux/type";
import axios from "axios";
import { variableData } from "@/redux/type";

export async function getClients() {
  const req: variableData = await axios.get(`${BASE_URL}/clients`, {
    withCredentials: true,
  });
  return req.data.clients;
}

export async function getClientData(id: number) {
  const req: variableData = await axios.get(`${BASE_URL}/clients/${id}`, {
    withCredentials: true,
  });
  return req.data.client;
}
