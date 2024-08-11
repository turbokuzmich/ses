import { z } from "zod";

export const userSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    email: z.string(),

    fio: z.string().optional().nullable().default(""),
    birthdate: z.string().optional().nullable().default(""),
    telegram: z.string().optional().nullable().default(""),
    vk: z.string().optional().nullable().default(""),
  })
  .required();
export type User = z.infer<typeof userSchema>;

export const isSubscribedSchema = z
  .object({
    subscribed: z.boolean(),
  })
  .required();
export type IsSubscribed = z.infer<typeof isSubscribedSchema>;

export const subscriptionRequestSchema = z
  .object({
    id: z.coerce.number(),
  })
  .required();
export type SubscriptionRequest = z.infer<typeof subscriptionRequestSchema>;
