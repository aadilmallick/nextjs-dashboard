interface FetcherProps {
  url: "/api/register" | "/api/signin" | "/api/project";
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  json?: boolean;
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
