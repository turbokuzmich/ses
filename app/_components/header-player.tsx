"use client";

import { Box, Container, IconButton, Stack, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import PauseIcon from "@mui/icons-material/Pause";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import Slider from "@mui/material/Slider";
import Image from "next/image";

import tempCover from "@/images/tmp-cover.jpg";
import { useCallback, useEffect, useRef, useState } from "react";

const fftSize = 128;
const barWidth = 10;
const canvasWidth = (fftSize / 2) * barWidth;
const canvasHeight = 50;

export default function HeaderPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gain, setGain] = useState(100.0);

  const isInitialized = useRef(false);
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const audioElementRef = useRef<HTMLAudioElement>(null);
  const canvasContext = useRef<CanvasRenderingContext2D | null>();
  const audioContext = useRef<AudioContext>();
  const sourceNode = useRef<MediaElementAudioSourceNode>();
  const gainNode = useRef<GainNode>();
  const analyzerNode = useRef<AnalyserNode>();
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!isInitialized.current && audioElementRef.current) {
      canvasContext.current = canvasElementRef.current?.getContext("2d");

      audioContext.current = new AudioContext();

      sourceNode.current = new MediaElementAudioSourceNode(
        audioContext.current,
        {
          mediaElement: audioElementRef.current,
        }
      );

      analyzerNode.current = audioContext.current.createAnalyser();
      analyzerNode.current.fftSize = fftSize;
      analyzerNode.current.minDecibels = -90;
      analyzerNode.current.maxDecibels = -10;

      gainNode.current = new GainNode(audioContext.current);

      sourceNode.current
        .connect(gainNode.current)
        .connect(analyzerNode.current)
        .connect(audioContext.current.destination);

      isInitialized.current = true;
    }
  }, []);

  useEffect(() => {
    function clear() {
      if (canvasContext.current) {
        canvasContext.current.clearRect(0, 0, canvasWidth, canvasHeight);
      }
    }

    function visualize() {
      rafRef.current = requestAnimationFrame(visualize);

      if (analyzerNode.current && canvasContext.current) {
        const bufferSize = analyzerNode.current.frequencyBinCount;
        const buffer = new Uint8Array(bufferSize);

        analyzerNode.current.getByteFrequencyData(buffer);

        clear();

        canvasContext.current.fillStyle = "#ffffff";

        buffer.forEach((value, index) => {
          canvasContext.current?.fillRect(
            index * barWidth,
            0,
            barWidth,
            (value / 255) * canvasHeight
          );
        });
      }
    }

    if (isPlaying) {
      visualize();
    } else if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      clear();
    }
  }, [isPlaying, analyzerNode, canvasContext, rafRef]);

  const onPlayClick = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      audioElementRef.current?.pause();
    } else {
      if (audioContext.current?.state === "suspended") {
        audioContext.current.resume();
      }

      setIsPlaying(true);
      audioElementRef.current?.play();
    }
  }, [isPlaying, analyzerNode, setIsPlaying]);

  const onGainChange = useCallback(
    (_: Event, value: number | number[]) => {
      const gain = Array.isArray(value) ? value[0] : value;

      if (gainNode.current) {
        gainNode.current.gain.value = gain / 100;
      }

      setGain(gain);
    },
    [setGain]
  );

  const onMuteClick = useCallback(() => {
    if (gainNode.current) {
      gainNode.current.gain.value = 0;
      setGain(0);
    }
  }, [setGain]);

  return (
    <Box bgcolor="background.paper">
      <Container>
        <audio
          // src="https://radio.skyses.space:8443/live"
          src="/sample.flac"
          ref={audioElementRef}
        />
        <Stack
          direction="row"
          spacing={6}
          paddingBlock={2}
          alignItems="center"
          useFlexGap
        >
          <Box flexShrink={0}>
            <Stack direction="row" spacing={2} alignItems="center" useFlexGap>
              <Image src={tempCover} width={50} height={50} alt="album cover" />
              <Box>
                <Typography component="div">Welcome to Horrorwood</Typography>
                <Typography color="grey.A700" variant="caption" component="div">
                  Ice Nine Kills
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box flexShrink={0}>
            <IconButton size="large" onClick={onPlayClick}>
              {isPlaying ? (
                <PauseIcon fontSize="large" />
              ) : (
                <PlayArrowIcon fontSize="large" />
              )}
            </IconButton>
          </Box>

          <Box flexGrow={1}>
            <canvas
              width={canvasWidth}
              height={canvasHeight}
              ref={canvasElementRef}
            />
          </Box>

          <Box flexShrink={0}>
            <Stack direction="row" spacing={2} width={150} alignItems="center">
              <IconButton size="large" onClick={onMuteClick}>
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
                sx={{
                  color: "common.white",
                }}
              />
            </Stack>
          </Box>

          <Box flexShrink={0}>
            <Stack direction="row" alignItems="center">
              <IconButton size="large">
                <FavoriteIcon fontSize="small" />
              </IconButton>
              <IconButton size="large">
                <PlaylistPlayIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
