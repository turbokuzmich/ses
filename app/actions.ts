"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

async function doSign(
  type: "signin" | "signup",
  redirectTo: string,
  data: Record<string, string>
) {
  try {
    await signIn("credentials", {
      type,
      redirectTo,
      redirect: true,
      ...data,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      const params = new URLSearchParams({
        type: error.type,
      });

      redirect(`/auth/error?${params.toString()}`);
    } else {
      throw error;
    }
  }
}

export async function doSignIn(data: Record<string, string>) {
  await doSign("signin", "/feed", data);
}

export async function doSignUp(data: Record<string, string>) {
  await doSign("signup", "/profile", data);
}

export async function doSignOut() {
  await signOut({
    redirect: true,
    redirectTo: "/",
  });
}
