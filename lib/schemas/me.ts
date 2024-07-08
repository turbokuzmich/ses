import { z } from "zod";
import { authorizedSchema } from "./auth";

export const meSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),

  fio: z.string().optional().nullable().default(""),
  birthdate: z.string().optional().nullable().default(""),
  telegram: z.string().optional().nullable().default(""),
  vk: z.string().optional().nullable().default(""),
});
export type Me = z.infer<typeof meSchema>;

export const meFormSchema = meSchema.omit({
  id: true,
  name: true,
  email: true,
});
export type MeForm = z.infer<typeof meFormSchema>;

export const fetchMeSchema = authorizedSchema;
export const updateMeSchema = authorizedSchema.and(meFormSchema);
