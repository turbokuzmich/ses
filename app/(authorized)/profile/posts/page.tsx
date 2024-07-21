"use client";

import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { createPostFormSchema, type CreatePostForm } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { postsApi } from "@/lib/store/slices/posts";

const defaultCreatePostValues: CreatePostForm = {
  text: "",
};

export default function Posts() {
  const { formState, handleSubmit, register, reset } = useForm<CreatePostForm>({
    defaultValues: defaultCreatePostValues,
    resolver: zodResolver(createPostFormSchema),
  });

  const [createPost] = postsApi.endpoints.createPost.useMutation();

  const onSubmit = useCallback(
    async (postData: CreatePostForm) => {
      await createPost(postData);

      reset();
    },
    [reset]
  );

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack alignItems="flex-start" gap={2} useFlexGap>
          <TextField
            size="small"
            autoComplete="false"
            placeholder="Напишите что-нибудь"
            rows={3}
            error={Boolean(formState.errors.text)}
            helperText={formState.errors.text?.message}
            fullWidth
            multiline
            {...register("text")}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={formState.isSubmitting}
          >
            Запостить
          </Button>
        </Stack>
      </form>
      <Divider />
    </>
  );
}
