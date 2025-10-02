import { BASE_URL } from "@/redux/type";
import axios from "axios";
import { variableData } from "@/redux/type";

export async function getClients(query: string = "") {
  const req: variableData = await axios.get(`${BASE_URL}/clients${query}`, {
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

export async function getUsers() {
  const req: variableData = await axios.get(`${BASE_URL}/users`, {
    withCredentials: true,
  });
  return req.data.users;
}

export async function getClientSubs(query: string = "") {
  const req: variableData = await axios.get(
    `${BASE_URL}/client-subscription${query}`,
    {
      withCredentials: true,
    }
  );
  return req.data.clientSubs;
}
