"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { unsubscribe as apiUnsubscribe } from "@/lib/api";

export async function unsubscribe(id: number) {
  const session = await auth();

  if (!session?.user) {
    return redirect("/");
  }

  await apiUnsubscribe(id, session.user.token);

  revalidatePath("/subscriptions", "page");
}
