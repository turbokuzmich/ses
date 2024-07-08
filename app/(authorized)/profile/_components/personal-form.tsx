"use client";

import type { Me, MeForm } from "@/lib/schemas";
import { meFormSchema } from "@/lib/schemas";
import { meApi } from "@/lib/store/slices/me";
import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

export default function PersonalForm() {
  const { currentData, isLoading } = meApi.endpoints.fetchMe.useQuery();

  if (isLoading) {
    return <CircularProgress />;
  }

  return <Form me={currentData} />;
}

function Form({ me }: Readonly<{ me: Me | undefined }>) {
  const { register, handleSubmit } = useForm<MeForm>({
    defaultValues: me,
    resolver: zodResolver(meFormSchema),
  });

  const [updateMe, { isLoading }] = meApi.endpoints.updateMe.useMutation();

  const onSubmit = useCallback((values: MeForm) => updateMe(values), []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} useFlexGap>
        <TextField
          disabled
          label="Ник"
          size="small"
          autoComplete="false"
          value={me?.name ?? ""}
        />
        <TextField
          disabled
          label="Электронная почта"
          size="small"
          autoComplete="false"
          value={me?.email ?? ""}
        />
        <TextField
          label="ФИО"
          size="small"
          autoComplete="false"
          disabled={isLoading}
          {...register("fio")}
        />
        <TextField
          label="Аккаунт Telegram"
          size="small"
          autoComplete="false"
          disabled={isLoading}
          {...register("telegram")}
        />
        <TextField
          label="Аккаунт VK"
          size="small"
          autoComplete="false"
          disabled={isLoading}
          {...register("vk")}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
        >
          Сохранить
        </Button>
      </Stack>
    </form>
  );
}
