import { z } from "zod";

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
      // TODO check size
      .refine((file) => file.type === "audio/wav", "Нужно загрузить wav"),
  })
  .required();
export type UploadMusicForm = z.infer<typeof updloadMusicFormSchema>;
