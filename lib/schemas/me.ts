import { z } from "zod";
import { authorizedSchema } from "./auth";

export const meSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  fio: z.string().optional().nullable(),
  birthdate: z.string().optional().nullable(),
  telegram: z.string().optional().nullable(),
  vk: z.string().optional().nullable(),
});

export type Me = z.infer<typeof meSchema>;

export const fetchMeSchema = authorizedSchema;
