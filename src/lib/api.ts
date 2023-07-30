import { Task } from "@prisma/client";

interface FetcherProps {
  url:
    | `/api/project/${string}`
    | "/api/register"
    | "/api/signin"
    | "/api/project"
    | "/api/task"
    | `/api/task/${string}`;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  json?: boolean;
  apiId?: string;
}

export interface IRegisterBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export async function fetcher({
  url,
  method,
  body,
  json,
}: {
  url: `/api/project/${string}`;
  method: "PATCH";
  body: { name: string; due?: string; id: string };
  json?: boolean;
}): Promise<any>;

// most general on top
export async function fetcher({
  url,
  method,
  body,
  json,
}: {
  url: `/api/project/${string}`;
  method: "DELETE";
  body: { id: string };
  json?: boolean;
}): Promise<any>;

export async function fetcher({
  url,
  method,
  body,
  json,
}: {
  url: "/api/register";
  method: "POST";
  body: IRegisterBody;
  json?: boolean;
}): Promise<any>;

export async function fetcher({
  url,
  method,
  body,
  json,
}: {
  url: "/api/signin";
  method: "POST";
  body: { email: string; password: string };
  json?: boolean;
}): Promise<any>;

export async function fetcher({
  url,
  method,
  body,
  json,
}: {
  url: "/api/project";
  method: "POST";
  body: { name: string };
  json?: boolean;
}): Promise<any>;

export async function fetcher({
  url,
  method,
  body,
  json,
}: {
  url: "/api/task";
  method: "POST";
  body: {
    name: string;
    description?: string;
    projectId: string;
    status?: Task["status"];
  };
  json?: boolean;
}): Promise<any>;

export async function fetcher({
  url,
  method,
  body,
  json,
}: {
  url: `/api/task/${string}`;
  method: "PATCH";
  body: {
    name?: string;
    description?: string;
    id: string;
    status?: Task["status"];
  };
  json?: boolean;
}): Promise<any>;

export async function fetcher({
  url,
  method,
  body,
  json,
}: {
  url: `/api/task/${string}`;
  method: "DELETE";
  body: {
    id: string;
  };
  json?: boolean;
}): Promise<any>;

export async function fetcher({ url, method, body, json }: FetcherProps) {
  const res = await fetch(url, {
    method,
    body: body && JSON.stringify(body),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("API Error");
  }

  if (json) {
    const data = await res.json();
    return data;
  }
}

// export const register = async (user) => {
//   return fetcher({
//     url: "/api/register",
//     method: "POST",
//     body: user,
//     json: false,
//   });
// };

// export const signin = async (user) => {
//   return fetcher({
//     url: "/api/signin",
//     method: "POST",
//     body: user,
//     json: false,
//   });
// };
