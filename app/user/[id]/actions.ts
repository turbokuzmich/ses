"use server";

import { subscriptionRequestSchema } from "@/lib/schemas";
import {
  subscribe as apiSubscribe,
  unsubscribe as apiUnsubscribe,
} from "@/lib/api";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

type SubscriptionHandler = typeof apiSubscribe | typeof apiUnsubscribe;

async function toggleSubscription(
  data: FormData,
  handler: SubscriptionHandler
) {
  const session = await auth();

  if (!session?.user) {
    return redirect("/");
  }

  const validatedData = subscriptionRequestSchema.safeParse(
    Object.fromEntries(data.entries())
  );

  if (validatedData.success) {
    await handler(validatedData.data.id, session.user.token);

    revalidatePath("/user", "page");
  }
}

export async function subscribe(data: FormData) {
  await toggleSubscription(data, apiSubscribe);
}

export async function unsubscribe(data: FormData) {
  await toggleSubscription(data, apiUnsubscribe);
}
