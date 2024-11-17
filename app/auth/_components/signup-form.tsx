"use client";

import type { FormSubmitHandler } from "react-hook-form";
import { Controller, Form, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { MouseEvent, useCallback } from "react";
import { doSignUp } from "../actions";
import { signUpSchema } from "@/lib/schemas";

const schema = signUpSchema
  .and(
    z.object({
      repassword: z
        .string({ required_error: "Пожалуйста, укажите пароль" })
        .min(6, "Пароль должен состоять минимум из 6 символов"),
    })
  )
  .refine((values) => values.password === values.repassword, {
    message: "Пароли не совпадают",
    path: ["repassword"],
  });

type SignupFormInputs = z.infer<typeof schema>;

export default function SignupForm({
  onSignin,
}: Readonly<{ onSignin(): void }>) {
  const { control, formState } = useForm<SignupFormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      login: "",
      password: "",
      repassword: "",
      nickname: "",
      role: "user",
    },
  });

  const onClickSignin = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      event.stopPropagation();

      onSignin();
    },
    [onSignin]
  );

  const onSubmit = useCallback(
    async (props: Parameters<FormSubmitHandler<SignupFormInputs>>[0]) => {
      await doSignUp(props.data);
    },
    []
  );

  return (
    <>
      <Typography variant="h4" mb={4} textAlign="center">
        Регистрация
      </Typography>
      <Form control={control} onSubmit={onSubmit}>
        <Stack direction="column" spacing={2} useFlexGap>
          <Controller
            name="login"
            control={control}
            render={({ field, formState }) => {
              return (
                <TextField
                  label="Электронный адрес"
                  size="small"
                  autoComplete="false"
                  disabled={formState.isSubmitting}
                  error={Boolean(formState.errors.login?.message)}
                  helperText={formState.errors.login?.message}
                  {...field}
                />
              );
            }}
          />
          <Controller
            name="nickname"
            control={control}
            render={({ field, formState }) => {
              return (
                <TextField
                  label="Ник"
                  size="small"
                  autoComplete="false"
                  disabled={formState.isSubmitting}
                  error={Boolean(formState.errors.nickname?.message)}
                  helperText={formState.errors.nickname?.message}
                  {...field}
                />
              );
            }}
          />
          <Controller
            name="password"
            control={control}
            render={({ field, formState }) => {
              return (
                <TextField
                  label="Пароль"
                  size="small"
                  autoComplete="false"
                  type="password"
                  disabled={formState.isSubmitting}
                  error={Boolean(formState.errors.password?.message)}
                  helperText={formState.errors.password?.message}
                  {...field}
                />
              );
            }}
          />
          <Controller
            name="repassword"
            control={control}
            render={({ field, formState }) => {
              return (
                <TextField
                  label="Повторите пароль"
                  size="small"
                  autoComplete="false"
                  type="password"
                  disabled={formState.isSubmitting}
                  error={Boolean(formState.errors.repassword?.message)}
                  helperText={formState.errors.repassword?.message}
                  {...field}
                />
              );
            }}
          />
          <Controller
            name="role"
            control={control}
            render={({ field, formState }) => {
              return (
                <ToggleButtonGroup
                  {...field}
                  disabled={formState.isSubmitting}
                  exclusive
                >
                  <ToggleButton value="user">Пользователь</ToggleButton>
                  <ToggleButton value="promo">Промо</ToggleButton>
                  <ToggleButton value="artist">Исполнитель</ToggleButton>
                </ToggleButtonGroup>
              );
            }}
          ></Controller>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={formState.isSubmitting}
          >
            Зарегистрироваться
          </Button>
          <Typography textAlign="center">
            Уже есть аккаунт?{" "}
            <Link href="/" component="a" onClick={onClickSignin}>
              Залогинься
            </Link>
          </Typography>
        </Stack>
      </Form>
    </>
  );
}
