"use client";

import { ChangeEvent, useCallback } from "react";
import { meApi } from "@/lib/store/slices/me";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ErrorIcon from "@mui/icons-material/Error";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type MusicUpload,
  type UploadMusicForm,
  updloadMusicFormSchema,
} from "@/lib/schemas";
import { styled } from "@mui/material/styles";
import { musicApi } from "@/lib/store/slices/music";
import { DateTime } from "luxon";
import { useSelector } from "react-redux";
import {
  selectIsPlaying,
  selectIsReady,
  selectTrack,
} from "@/lib/store/selectors/player";
import { useAppDispatch } from "@/lib/store";
import { playerSlice } from "@/lib/store/slices/player";

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
  const dispatch = useAppDispatch();

  const { currentData: me, isFetching } = meApi.endpoints.fetchMe.useQuery();

  const { currentData: music } = musicApi.endpoints.my.useQuery(undefined, {
    pollingInterval: 30000,
    refetchOnFocus: true,
    skipPollingIfUnfocused: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  });

  const currentTrack = useSelector(selectTrack);
  const isPlayerPlaying = useSelector(selectIsPlaying);
  const isPlayerReady = useSelector(selectIsReady);

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

  const onPlay = useCallback(
    (track: MusicUpload) => {
      if (track.id !== currentTrack?.id) {
        dispatch(playerSlice.actions.play(track));
      } else if (isPlayerPlaying) {
        dispatch(playerSlice.actions.pause());
      } else {
        dispatch(playerSlice.actions.resume());
      }
    },
    [currentTrack, isPlayerPlaying]
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
      {/** extract to separate component */}
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
      <Divider />
      {/** extract to separate component */}
      <Stack gap={2} useFlexGap>
        {(music ?? []).map((music) => {
          const createdAt = DateTime.fromISO(music.createdAt).setLocale("ru");

          const isFailed = music.status === "ERROR";

          const isProcessing =
            music.status !== "ERROR" && music.status !== "PROCESSED";

          const isProcessed = music.status === "PROCESSED";

          const isDisabled = music.status !== "PROCESSED" || !isPlayerReady;

          const isTrackPlaying =
            isPlayerPlaying && music.id === currentTrack?.id;

          const playButton = (
            <IconButton
              size="medium"
              disabled={isDisabled}
              onClick={() => onPlay(music)}
            >
              {isFailed ? <ErrorIcon fontSize="medium" /> : null}
              {isProcessing ? <HourglassBottomIcon fontSize="medium" /> : null}
              {isTrackPlaying ? <PauseIcon fontSize="medium" /> : null}
              {isProcessed && !isTrackPlaying ? (
                <PlayArrowIcon fontSize="medium" />
              ) : null}
            </IconButton>
          );
          return (
            <Card
              key={music.id}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <CardHeader
                avatar={playButton}
                title={music.title}
                titleTypographyProps={{ variant: "h6" }}
                sx={{ flexGrow: 1 }}
              />
              <Typography
                component="div"
                padding={2}
                flexShrink={0}
                color="textSecondary"
              >
                {createdAt.toLocaleString(DateTime.DATE_MED)}{" "}
                {createdAt.toLocaleString(DateTime.TIME_24_SIMPLE)}
              </Typography>
            </Card>
          );
        })}
      </Stack>
    </>
  );
}
