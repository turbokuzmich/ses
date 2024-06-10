import { z } from "zod";
import cookie from "cookie";
import type { User } from "next-auth";
import {
  apiUserSchema,
  signInSchema,
  signUpSchema,
  fetchMeSchema,
  personalDataSchema,
} from "../schemas";

export async function signIn({
  login,
  password,
}: z.infer<typeof signInSchema>): Promise<User | null> {
  const response = await fetch(
    `${process.env.API_HOST}:${process.env.API_PORT}/account/signin`,
    {
      body: JSON.stringify({ login, password }),
      cache: "no-store",
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    }
  );

  if (response.status !== 200) {
    return null;
  }

  const token = response.headers
    .getSetCookie()
    .map((item) => cookie.parse(item))
    .find((cookies) => cookies[process.env.SESSION_COOKIE_NAME!])?.[
    process.env.SESSION_COOKIE_NAME!
  ];

  if (!token) {
    return null;
  }

  const parsedUser = apiUserSchema.safeParse(await response.json());

  if (!parsedUser.success) {
    return null;
  }

  const user: User = { ...parsedUser.data, token };

  return user;
}

export async function signUp({
  login,
  password,
  nickname,
}: z.infer<typeof signUpSchema>) {
  const response = await fetch(
    `${process.env.API_HOST}:${process.env.API_PORT}/account/signup`,
    {
      body: JSON.stringify({ login, password, nickname }),
      cache: "no-store",
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    }
  );

  if (response.status !== 200) {
    return null;
  }

  const token = response.headers
    .getSetCookie()
    .map((item) => cookie.parse(item))
    .find((cookies) => cookies[process.env.SESSION_COOKIE_NAME!])?.[
    process.env.SESSION_COOKIE_NAME!
  ];

  if (!token) {
    return null;
  }

  const parsedUser = apiUserSchema.safeParse(await response.json());

  if (!parsedUser.success) {
    return null;
  }

  const user: User = { ...parsedUser.data, token };

  return user;
}

export async function fetchMe({ token }: z.infer<typeof fetchMeSchema>) {
  const response = await fetch(
    `${process.env.API_HOST}:${process.env.API_PORT}/account/personal`,
    {
      cache: "no-store",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.status !== 200) {
    return null;
  }

  const parsedMe = personalDataSchema.safeParse(await response.json());

  if (!parsedMe.success) {
    return null;
  }

  return parsedMe.data;
}
