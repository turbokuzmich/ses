import { z } from "zod";
import type { User } from "next-auth";
import {
  apiUserSchema,
  signInSchema,
  signUpSchema,
  fetchMeSchema,
  meSchema,
  updateMeSchema,
  CreatePost,
  postSchema,
} from "../schemas";

function getEnpointUrl(endpoint: string) {
  return `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${endpoint}`;
}

export async function signIn({
  login,
  password,
}: z.infer<typeof signInSchema>): Promise<User | null> {
  const response = await fetch(getEnpointUrl("/auth/signin"), {
    body: JSON.stringify({ login, password }),
    cache: "no-store",
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
  });

  if (response.status !== 200) {
    return null;
  }

  const parsedUser = apiUserSchema.safeParse(await response.json());

  if (!parsedUser.success) {
    return null;
  }

  return parsedUser.data as User;
}

export async function signUp({
  login,
  password,
  nickname,
}: z.infer<typeof signUpSchema>) {
  const response = await fetch(getEnpointUrl("/auth/signup"), {
    body: JSON.stringify({ login, password, nickname }),
    cache: "no-store",
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
  });

  if (response.status !== 200) {
    return null;
  }

  const parsedUser = apiUserSchema.safeParse(await response.json());

  if (!parsedUser.success) {
    return null;
  }

  return parsedUser.data as User;
}

export async function fetchMe({ token }: z.infer<typeof fetchMeSchema>) {
  const response = await fetch(getEnpointUrl("/users/me"), {
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 200) {
    return null;
  }

  const parsedMe = meSchema.safeParse(await response.json());

  if (!parsedMe.success) {
    return null;
  }

  return parsedMe.data;
}

export async function updateMe({
  token,
  ...data
}: z.infer<typeof updateMeSchema>) {
  const response = await fetch(getEnpointUrl("/users/me"), {
    cache: "no-store",
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (response.status !== 200) {
    return null;
  }

  const parsedMe = meSchema.safeParse(await response.json());

  if (!parsedMe.success) {
    return null;
  }

  return parsedMe.data;
}

export async function createPost({ token, ...data }: CreatePost) {
  const response = await fetch(getEnpointUrl("/posts"), {
    cache: "no-store",
    method: "PUT",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (response.status !== 200) {
    return null;
  }

  const parsedPost = postSchema.safeParse(await response.json());

  if (!parsedPost.success) {
    return null;
  }

  return parsedPost.data;
}
