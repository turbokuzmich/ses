import { z } from "zod";
import { authorizedSchema } from "./auth";

export const updloadMusicFormSchema = z
  .object({
    title: z
      .string({
        required_error: "Пожалуйста, укажите название",
      })
      .min(3, "Название должно содержать хотя бы 3 символа"),
    description: z
      .string({
        required_error: "Пожалуйста, укажите описание",
      })
      .min(3, "Описание должно содержать хотя бы 3 символа"),
    file: z
      .instanceof(File, {
        message: "Пожалуйста, выберите файл",
      })
      .refine(
        (file) => ["audio/wav", "audio/mpeg"].includes(file.type),
        "Нужно загрузить wav"
      )
      .refine(
        (file) => file.size <= 250 * 1024 * 1024,
        "Размер файла не должен превышать 250 Мб"
      ),
  })
  .required();
export type UploadMusicForm = z.infer<typeof updloadMusicFormSchema>;

export const createUploadMusicSchema = authorizedSchema.and(
  updloadMusicFormSchema.omit({
    file: true,
  })
);
export type CreateUploadMusic = z.infer<typeof createUploadMusicSchema>;

export const musicStatusSchema = z.enum([
  "INITIAL",
  "UPLOADED",
  "PROCESSING",
  "PROCESSED",
  "ERROR",
]);
export type MusicStatus = z.infer<typeof musicStatusSchema>;

export const musicUploadSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  status: musicStatusSchema,
  error: z.string().optional().nullable(), // Maybe redundant
  path: z.string(),
  createdAt: z.string().datetime(),
});
export type MusicUpload = z.infer<typeof musicUploadSchema>;
