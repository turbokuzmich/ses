import { z } from "zod";
import cookie from "cookie";
import type { User } from "next-auth";
import { signInSchema, signUpSchema } from "../schemas";

const ApiUserSchema = z.object({
  id: z.coerce.string(),
  name: z.string(),
  email: z.string().email(),
});

export async function signIn({
  login,
  password,
}: z.infer<typeof signInSchema>): Promise<User | null> {
  const response = await fetch(
    `${process.env.API_HOST}:${process.env.API_PORT}/account/signin`,
    {
      body: JSON.stringify({ Email: login, Pass: password }),
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

  const parsedUser = ApiUserSchema.safeParse(await response.json());

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
      body: JSON.stringify({ Email: login, Pass: password, Nick: nickname }),
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

  const parsedUser = ApiUserSchema.safeParse(await response.json());

  if (!parsedUser.success) {
    return null;
  }

  const user: User = { ...parsedUser.data, token };

  return user;
}
