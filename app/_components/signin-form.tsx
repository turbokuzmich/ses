"use client";

import type { FormSubmitHandler } from "react-hook-form";
import { z } from "zod";
import { MouseEvent } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Controller, Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doSignIn } from "../actions";
import { useCallback } from "react";
import { signInSchema } from "@/lib/schemas";

type SigninFormInputs = z.infer<typeof signInSchema>;

export default function SiginForm({
  onSignup,
}: Readonly<{ onSignup(): void }>) {
  const { control, formState } = useForm<SigninFormInputs>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    async (props: Parameters<FormSubmitHandler<SigninFormInputs>>[0]) => {
      await doSignIn(props.data);
    },
    []
  );

  const onClickSignup = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      event.stopPropagation();

      onSignup();
    },
    [onSignup]
  );

  return (
    <Form control={control} onSubmit={onSubmit}>
      <Stack direction="column" gap={2} useFlexGap>
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
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={formState.isSubmitting}
        >
          Войти
        </Button>
        <Typography textAlign="center">
          Нет аккаунта?{" "}
          <Link href="/" component="a" onClick={onClickSignup}>
            Зарегистрируйся
          </Link>
        </Typography>
      </Stack>
    </Form>
  );
}
