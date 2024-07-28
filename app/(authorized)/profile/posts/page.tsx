"use client";

import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { useForm } from "react-hook-form";
import { createPostFormSchema, type CreatePostForm } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useMemo } from "react";
import { postsApi } from "@/lib/store/slices/posts";
import { meApi } from "@/lib/store/slices/me";
import stc from "string-to-color";
import { DateTime } from "luxon";

const defaultCreatePostValues: CreatePostForm = {
  text: "",
};

export default function Posts() {
  const { currentData: me } = meApi.endpoints.fetchMe.useQuery();

  const letter = useMemo(
    () => (me ? me.name.charAt(0).toUpperCase() : null),
    [me]
  );

  const color = useMemo(() => (me ? stc(me.name) : null), [me]);

  const { data: posts } = postsApi.endpoints.fetchMyPosts.useQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

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
      {/* TODO вынести список постов в отдельный компонент */}
      <Stack gap={2} useFlexGap>
        {(posts ?? []).map((post) => {
          const createdAt = DateTime.fromISO(post.createdAt).setLocale("ru");

          return (
            <Card key={post.id}>
              {me ? (
                <CardHeader
                  avatar={
                    <Avatar alt={me.name} sx={{ bgcolor: color }}>
                      {letter}
                    </Avatar>
                  }
                  title={me.name}
                  subheader={`${createdAt.toLocaleString(
                    DateTime.DATE_MED
                  )} ${createdAt.toLocaleString(DateTime.TIME_24_SIMPLE)}`}
                />
              ) : null}
              <CardContent>{post.text}</CardContent>
            </Card>
          );
        })}
      </Stack>
    </>
  );
}
