import { z } from "zod";

export const apiUserSchema = z.object({
  id: z.coerce.string(),
  name: z.string(),
  email: z.string().email(),
  token: z.string(),
});

export const signInSchema = z.object({
  login: z
    .string({ required_error: "Пожалуйста, укажите электронную почту" })
    .email("Пожалуйста, укажите корректный электронную почту"),
  password: z
    .string({ required_error: "Пожалуйста, укажите пароль" })
    .min(6, "Пароль должен состоять минимум из 6 символов"),
});

export const signUpSchema = signInSchema.and(
  z.object({
    role: z.enum(["user", "artist", "promo"], {
      message: "Пожалуйста, выберите роль",
    }),
    nickname: z
      .string({
        required_error: "Пожалуйста, укажите ник",
      })
      .min(3, "Ник должен состоять минимум из 3 символов"),
  })
);

export const authorizedSchema = z
  .object({
    token: z.string({ required_error: "Неавторизованный запрос" }),
  })
  .required();
