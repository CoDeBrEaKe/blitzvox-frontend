import { BASE_URL } from "@/redux/type";
import axios from "axios";
import { variableData } from "@/redux/type";

export async function getClients(
  query: string = "",
  params: object = { page: 1, limit: 10, query: "" }
) {
  const req: variableData = await axios.get(
    `${BASE_URL}/clients?page=${(params as any).page}&limit=${
      (params as any).limit
    }&${query}`,
    {
      withCredentials: true,
    }
  );
  return req.data;
}

export async function getClientData(id: number) {
  const req: variableData = await axios.get(`${BASE_URL}/clients/${id}`, {
    withCredentials: true,
  });
  return req.data.client;
}

export async function getUsers(
  query: string = "",
  params: object = { page: 1, limit: 10 }
) {
  const req: variableData = await axios.get(
    `${BASE_URL}/users?page=${(params as any).page}&limit=${
      (params as any).limit
    }&${query}`,
    {
      withCredentials: true,
    }
  );
  return req.data;
}

export async function getUserData(id: number) {
  const req: variableData = await axios.get(`${BASE_URL}/users/${id}`, {
    withCredentials: true,
  });
  return req.data.user;
}

export async function getClientSubs(
  query: string = "",
  params: object = {
    page: 1,
    limit: 10,
    date: { sign_date: [] },
  }
) {
  const req: variableData = await axios.post(
    `${BASE_URL}/client-subscription?page=${(params as any).page}&limit=${
      (params as any).limit
    }&${query}`,
    {
      date: (params as any).date,
    },
    {
      withCredentials: true,
    }
  );
  return req.data;
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
export async function getSubscriptions(
  query: string = "",
  params: object = { page: 1, limit: 10 }
) {
  const req: variableData = await axios.get(
    `${BASE_URL}/subscriptions?page=${(params as any).page}&limit=${
      (params as any).limit
    }&${query}`,
    {
      withCredentials: true,
    }
  );
  return req.data;
}

export async function getSubscriptionData(id: number) {
  const req: variableData = await axios.get(`${BASE_URL}/subscriptions/${id}`, {
    withCredentials: true,
  });
  return req.data.subscription;
}

export async function getSubscriptionTypes(
  query: string = "",
  params: object = { page: 1, limit: 10 }
) {
  const req = await axios.get(
    `${BASE_URL}/subscription-types?page=${(params as any).page}&limit=${
      (params as any).limit
    }&${query}`,
    {
      withCredentials: true,
    }
  );
  return req.data;
}

export async function getSubscriptionTypeData(id: number) {
  const req: variableData = await axios.get(
    `${BASE_URL}/subscription-types/${id}`,
    {
      withCredentials: true,
    }
  );
  return req.data.type;
}

export async function getEmails(
  query: string = "",
  params: object = { page: 1, limit: 10 }
) {
  const req: variableData = await axios.get(
    `${BASE_URL}/emails?page=${(params as any).page}&limit=${
      (params as any).limit
    }&${query}`,
    {
      withCredentials: true,
    }
  );
  return req.data;
}

export async function getEmailData(id: number) {
  const req: variableData = await axios.get(`${BASE_URL}/emails/${id}`, {
    withCredentials: true,
  });
  return req.data.email;
}

export async function getFeedbacks(id: number, client: string) {
  const req: variableData = await axios.get(
    `${BASE_URL}/feedbacks/${id}/${client}`,
    {
      withCredentials: true,
    }
  );
  return req.data.feedbacks;
}
