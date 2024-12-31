"use client";

import { ChangeEvent, useCallback } from "react";
import { meApi } from "@/lib/store/slices/me";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UploadMusicForm, updloadMusicFormSchema } from "@/lib/schemas";
import { styled } from "@mui/material/styles";
import { musicApi } from "@/lib/store/slices/music";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const defaultFormValues: Partial<UploadMusicForm> = {
  title: "",
  description: "",
};

export default function Music() {
  const { currentData: me, isFetching } = meApi.endpoints.fetchMe.useQuery();

  const [uploadMusic] = musicApi.endpoints.upload.useMutation();

  const { formState, register, setValue, handleSubmit, watch, reset } =
    useForm<UploadMusicForm>({
      defaultValues: defaultFormValues,
      resolver: zodResolver(updloadMusicFormSchema),
    });

  const onFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files?.length) {
        setValue("file", event.target.files[0], {
          shouldTouch: true,
          shouldValidate: true,
        });
      }
    },
    [setValue]
  );

  const selectedFile: File | undefined = watch("file");

  const onSubmit = useCallback(async (data: UploadMusicForm) => {
    await uploadMusic(data);

    reset();
  }, []);

  if (!isFetching && (!me || me.role !== "artist")) {
    return <Typography>Вы не можете загружать музыку</Typography>;
  }

  return (
    <>
      <Typography variant="h5">Загрузить</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={2} alignItems="flex-start" useFlexGap>
          <TextField
            size="small"
            autoComplete="false"
            placeholder="Название"
            error={Boolean(formState.errors.title)}
            helperText={formState.errors.title?.message}
            fullWidth
            {...register("title")}
          />
          <TextField
            size="small"
            autoComplete="false"
            placeholder="Описание"
            rows={3}
            error={Boolean(formState.errors.description)}
            helperText={formState.errors.description?.message}
            fullWidth
            multiline
            {...register("description")}
          />
          <Button
            color={
              formState.errors.file || !selectedFile ? "secondary" : "success"
            }
            component="label"
            variant="contained"
            tabIndex={-1}
            fullWidth
          >
            {selectedFile ? selectedFile.name : "wav или mp3 не более 250 Мб"}
            <VisuallyHiddenInput
              accept=".wav,.mp3"
              name="file"
              type="file"
              onChange={onFileChange}
            />
          </Button>
          {formState.errors.file ? (
            <Typography color="error" variant="body2">
              {formState.errors.file.message}
            </Typography>
          ) : null}
          <Button
            size="large"
            type="submit"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            disabled={formState.isSubmitting}
          >
            Загрузить
          </Button>
        </Stack>
      </form>
    </>
  );
}
