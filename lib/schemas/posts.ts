import { z } from "zod";
import { authorizedSchema } from "./auth";

export const postSchema = z
  .object({
    id: z.number().positive(),
    text: z.string(),
    userId: z.number().positive(),
  })
  .required();
export type Post = z.infer<typeof postSchema>;

export const createPostFormSchema = z
  .object({
    text: z
      .string({ required_error: "Пожалуйста, введите текст" })
      .min(1, "Слишком короткий текст"),
  })
  .required();
export type CreatePostForm = z.infer<typeof createPostFormSchema>;

export const createPostSchema = authorizedSchema.and(createPostFormSchema);
export type CreatePost = z.infer<typeof createPostSchema>;
