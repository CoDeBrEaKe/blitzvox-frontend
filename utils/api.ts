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
export async function getClientSubData(id: number) {
  const req: variableData = await axios.get(
    `${BASE_URL}/client-subscription/${id}`,
    {
      withCredentials: true,
    }
  );
  return req.data.clientSub;
}
export async function getSubscriptions(query: string = "") {
  const req: variableData = await axios.get(
    `${BASE_URL}/subscriptions${query}`,
    {
      withCredentials: true,
    }
  );
  return req.data.subscriptions;
}
export async function getSubscriptionData(id: number) {
  const req: variableData = await axios.get(`${BASE_URL}/subscriptions/${id}`, {
    withCredentials: true,
  });
  return req.data.subscription;
}
export async function getSubscriptionTypes(query: string = "") {
  const req = await axios.get(`${BASE_URL}/subscription-types`, {
    withCredentials: true,
  });
  return req.data.types;
}
