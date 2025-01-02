"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Logo from "@/lib/components/logo-cut";
import A from "@mui/material/Link";
import Link from "next/link";
import Slider from "@mui/material/Slider";
import UserAvatar from "./avatar";
import ReactPlayer from "react-player";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import PauseIcon from "@mui/icons-material/Pause";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectGain,
  selectIsPlaying,
  selectIsReady,
  selectTrack,
} from "@/lib/store/selectors/player";
import { useAppDispatch } from "@/lib/store";
import { playerSlice } from "@/lib/store/slices/player";

export default function HeaderPlayer() {
  const dispatch = useAppDispatch();

  const isReady = useSelector(selectIsReady);
  const isPlaying = useSelector(selectIsPlaying);
  const gain = useSelector(selectGain);
  const track = useSelector(selectTrack);

  const url = useMemo(
    () =>
      track
        ? [{ src: `/api/music/${track.id}`, type: "audio/mpeg" }]
        : undefined,
    [track]
  );

  const areControlsDisabled = !isReady || !track;

  const onPlayClick = useCallback(() => {
    if (isPlaying) {
      dispatch(playerSlice.actions.pause());
    } else {
      dispatch(playerSlice.actions.resume());
    }
  }, [isPlaying]);

  const onMuteClick = useCallback(() => {
    if (gain > 0) {
      dispatch(playerSlice.actions.setGain(0));
    } else {
      dispatch(playerSlice.actions.setGain(100));
    }
  }, [gain]);

  const onGainChange = useCallback((_: Event, value: number | number[]) => {
    const gain = Array.isArray(value) ? value[0] : value;

    dispatch(playerSlice.actions.setGain(gain));
  }, []);

  useEffect(() => {
    if (!isReady) {
      dispatch(playerSlice.actions.setIsReady());
    }
  }, [isReady]);

  return (
    <Box bgcolor="background.paper">
      <Box sx={{ display: "none" }}>
        {isReady ? (
          <ReactPlayer url={url} playing={isPlaying} volume={gain / 100} />
        ) : null}
      </Box>
      <Container>
        <Stack
          direction="row"
          spacing={6}
          paddingBlock={2}
          alignItems="center"
          useFlexGap
        >
          <A href="/" component={Link} sx={{ width: 37 }}>
            <Logo />
          </A>
          {/* <Box flexShrink={0}>
            <Stack direction="row" spacing={2} alignItems="center" useFlexGap>
              <Image src={tempCover} width={50} height={50} alt="album cover" />
              <Box>
                <Typography component="div">Welcome to Horrorwood</Typography>
                <Typography color="grey.A700" variant="caption" component="div">
                  Ice Nine Kills
                </Typography>
              </Box>
            </Stack>
          </Box> */}

          <Stack
            direction="row"
            flexShrink={0}
            flexGrow={1}
            spacing={1}
            useFlexGap
          >
            <IconButton
              size="large"
              onClick={onPlayClick}
              disabled={areControlsDisabled}
            >
              {isPlaying ? (
                <PauseIcon fontSize="large" />
              ) : (
                <PlayArrowIcon fontSize="large" />
              )}
            </IconButton>
            <Stack direction="row" spacing={2} width={150} alignItems="center">
              <IconButton
                size="large"
                onClick={onMuteClick}
                disabled={areControlsDisabled}
              >
                {gain === 0 ? (
                  <VolumeOffIcon fontSize="small" />
                ) : (
                  <VolumeUpIcon fontSize="small" />
                )}
              </IconButton>
              <Slider
                onChange={onGainChange}
                value={gain}
                size="small"
                disabled={areControlsDisabled}
                sx={{ color: "common.white" }}
              />
            </Stack>
          </Stack>

          {/* <Box flexShrink={0}>
            <Stack direction="row" alignItems="center">
              <IconButton size="large">
                <FavoriteIcon fontSize="small" />
              </IconButton>
              <IconButton size="large">
                <PlaylistPlayIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box> */}

          <UserAvatar />
        </Stack>
      </Container>
    </Box>
  );
}
