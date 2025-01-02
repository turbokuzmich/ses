import { z } from "zod";
import { merge } from "lodash";
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
  type Entity,
  type EntityRelation,
  type CheckEntity,
  postSchema,
  authorizedSchema,
  userSchema,
  isSubscribedSchema,
  checkEntitySchema,
  CreateUploadMusic,
  musicUploadSchema,
} from "../schemas";

const defaultRequestInit: Partial<RequestInit> = {
  cache: "no-store",
  headers: {
    "content-type": "application/json",
  },
};

function getEnpointUrl(endpoint: string) {
  return new URL(
    `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${endpoint}`
  );
}

function withToken(token: string, init?: Partial<RequestInit>) {
  return merge(
    {},
    defaultRequestInit,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
    init
  );
}

export async function signIn({
  login,
  password,
}: z.infer<typeof signInSchema>): Promise<AuthorizedUser | null> {
  const response = await fetch(
    getEnpointUrl("/auth/signin"),
    merge({}, defaultRequestInit, {
      body: JSON.stringify({ login, password }),
      method: "POST",
    })
  );

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
  const response = await fetch(
    getEnpointUrl("/auth/signup"),
    merge({}, defaultRequestInit, {
      body: JSON.stringify({ login, password, nickname, role }),
      method: "POST",
    })
  );

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
  const response = await fetch(getEnpointUrl("/users/me"), withToken(token));

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
  const response = await fetch(
    getEnpointUrl("/users/me"),
    withToken(token, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  );

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
  const response = await fetch(getEnpointUrl("/posts/my"), withToken(token));

  if (response.status !== 200) {
    return null;
  }

  return (await response.json()) as Post[];
}

export async function createPost({ token, ...data }: CreatePost) {
  const response = await fetch(
    getEnpointUrl("/posts"),
    withToken(token, {
      method: "POST",
      body: JSON.stringify(data),
    })
  );

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
  const response = await fetch(
    getEnpointUrl(`/users/${id}`),
    defaultRequestInit
  );

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
  const response = await fetch(
    getEnpointUrl(`/posts/by-user/${id}`),
    defaultRequestInit
  );

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
  const response = await fetch(
    getEnpointUrl(`/users/is-subscribed/${id}`),
    withToken(token)
  );

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
  const response = await fetch(
    getEnpointUrl(`/users/subscribe/${id}`),
    withToken(token, { method: "POST" })
  );

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
  const response = await fetch(
    getEnpointUrl(`/users/subscribe/${id}`),
    withToken(token, { method: "DELETE" })
  );

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
  const response = await fetch(
    getEnpointUrl("/users/subscriptions"),
    withToken(token)
  );

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

export async function checkEntity(
  entity: Entity,
  relation: EntityRelation,
  token: string
): Promise<CheckEntity> {
  const url = getEnpointUrl("/acl/check-entity");
  url.searchParams.set("entity", entity);
  url.searchParams.set("relation", relation);

  const response = await fetch(url, withToken(token));

  if (response.status !== 200) {
    return { allowed: false };
  }

  const parsedCheck = checkEntitySchema.safeParse(await response.json());

  if (!parsedCheck.success) {
    return { allowed: false };
  }

  return parsedCheck.data;
}

export async function createUpload({ token, ...payload }: CreateUploadMusic) {
  const response = await fetch(
    getEnpointUrl("/music/my/upload"),
    withToken(token, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  );

  if (response.status !== 200) {
    return null;
  }

  const parsedMusicUpload = musicUploadSchema.safeParse(await response.json());

  return parsedMusicUpload.success ? parsedMusicUpload.data : null;
}

export async function processUpload(id: number, token: string) {
  const response = await fetch(
    getEnpointUrl(`/music/my/process/${id}`),
    withToken(token, {
      method: "POST",
    })
  );

  return response.status === 200;
}

export async function fetchMyMusic(token: string) {
  const response = await fetch(
    getEnpointUrl("/music/my/uploads"),
    withToken(token)
  );

  if (response.status !== 200) {
    return null;
  }

  const parsedMusic = musicUploadSchema
    .array()
    .safeParse(await response.json());

  return parsedMusic.success ? parsedMusic.data : null;
}

export async function fetchMusicById(id: string | number, token: string) {
  const response = await fetch(
    getEnpointUrl(`/music/track/${id}`),
    withToken(token)
  );

  if (response.status !== 200) {
    return null;
  }

  const parsedMusic = musicUploadSchema.safeParse(await response.json());

  return parsedMusic.success ? parsedMusic.data : null;
}
