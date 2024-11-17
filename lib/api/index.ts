import { z } from "zod";
import type { User as AuthorizedUser } from "next-auth";
import {
  apiUserSchema,
  signInSchema,
  signUpSchema,
  fetchMeSchema,
  meSchema,
  updateMeSchema,
  type CreatePost,
  type Post,
  postSchema,
  authorizedSchema,
  userSchema,
  isSubscribedSchema,
} from "../schemas";

function getEnpointUrl(endpoint: string) {
  return `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${endpoint}`;
}

export async function signIn({
  login,
  password,
}: z.infer<typeof signInSchema>): Promise<AuthorizedUser | null> {
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

  return parsedUser.data as AuthorizedUser;
}

export async function signUp({
  login,
  password,
  nickname,
  role,
}: z.infer<typeof signUpSchema>) {
  const response = await fetch(getEnpointUrl("/auth/signup"), {
    body: JSON.stringify({ login, password, nickname, role }),
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

  return parsedUser.data as AuthorizedUser;
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

  const parsedMe = meSchema.safeParse(await response.json());

  if (!parsedMe.success) {
    return null;
  }

  return parsedMe.data;
}

export async function fetchMyPosts({
  token,
}: z.infer<typeof authorizedSchema>) {
  const response = await fetch(getEnpointUrl("/posts/my"), {
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 200) {
    return null;
  }

  return (await response.json()) as Post[];
}

export async function createPost({ token, ...data }: CreatePost) {
  const response = await fetch(getEnpointUrl("/posts"), {
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

  const parsedPost = postSchema.safeParse(await response.json());

  if (!parsedPost.success) {
    return null;
  }

  return parsedPost.data;
}

export async function getUser(id: number) {
  const response = await fetch(getEnpointUrl(`/users/${id}`), {
    cache: "no-store",
    headers: {
      "content-type": "application/json",
    },
  });

  if (response.status !== 200) {
    return null;
  }

  const parsedUser = userSchema.safeParse(await response.json());

  if (!parsedUser.success) {
    return null;
  }

  return parsedUser.data;
}

export async function getPostsByUser(id: number) {
  const response = await fetch(getEnpointUrl(`/posts/by-user/${id}`), {
    cache: "no-store",
    headers: {
      "content-type": "application/json",
    },
  });

  if (response.status !== 200) {
    return [];
  }

  const parsedPosts = postSchema.array().safeParse(await response.json());

  if (!parsedPosts.success) {
    return [];
  }

  return parsedPosts.data;
}

export async function isSubscribed(id: number, token: string) {
  const response = await fetch(getEnpointUrl(`/users/is-subscribed/${id}`), {
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 200) {
    return false;
  }

  const parsedSubscription = isSubscribedSchema.safeParse(
    await response.json()
  );

  if (!parsedSubscription.success) {
    return false;
  }

  return parsedSubscription.data.subscribed;
}

export async function subscribe(id: number, token: string) {
  const response = await fetch(getEnpointUrl(`/users/subscribe/${id}`), {
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    method: "POST",
  });

  if (response.status !== 200) {
    return false;
  }

  const parsedSubscription = isSubscribedSchema.safeParse(
    await response.json()
  );

  if (!parsedSubscription.success) {
    return false;
  }

  return parsedSubscription.data.subscribed;
}

export async function unsubscribe(id: number, token: string) {
  const response = await fetch(getEnpointUrl(`/users/subscribe/${id}`), {
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    method: "DELETE",
  });

  if (response.status !== 200) {
    return false;
  }

  const parsedSubscription = isSubscribedSchema.safeParse(
    await response.json()
  );

  if (!parsedSubscription.success) {
    return false;
  }

  return parsedSubscription.data.subscribed;
}

export async function fetchSubscriptions(token: string) {
  const response = await fetch(getEnpointUrl("/users/subscriptions"), {
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 200) {
    return [];
  }

  const parsedSubscriptions = userSchema
    .array()
    .safeParse(await response.json());

  if (!parsedSubscriptions.success) {
    return [];
  }

  return parsedSubscriptions.data;
}
