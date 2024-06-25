import { z } from "zod";
import { authorizedSchema } from "./auth";

export const personalDataSchema = z.object({
  fio: z.string().optional().nullable(),
  birthdate: z.string().optional().nullable(),
  telegram: z.string().optional().nullable(),
  vk: z.string().optional().nullable(),
});

export const fetchMeSchema = authorizedSchema;
