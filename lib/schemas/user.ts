import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),

  fio: z.string().optional().nullable().default(""),
  birthdate: z.string().optional().nullable().default(""),
  telegram: z.string().optional().nullable().default(""),
  vk: z.string().optional().nullable().default(""),
});
export type User = z.infer<typeof userSchema>;
