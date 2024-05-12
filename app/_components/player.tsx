"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import PauseIcon from "@mui/icons-material/Pause";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import Slider from "@mui/material/Slider";
import Image from "next/image";
import UserAvatar from "./avatar";
import AudioMotionAnalyzer from "audiomotion-analyzer";

import tempCover from "@/images/tmp-cover.jpg";

export default function HeaderPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gain, setGain] = useState(100.0);

  const isInitialized = useRef(false);
  const visializerContainerRef = useRef<HTMLDivElement>();
  const audioElementRef = useRef<HTMLAudioElement>(null);
  const audioContext = useRef<AudioContext>();
  const sourceNode = useRef<MediaElementAudioSourceNode>();
  const gainNode = useRef<GainNode>();

  useEffect(() => {
    if (!isInitialized.current && audioElementRef.current) {
      audioContext.current = new AudioContext();

      sourceNode.current = new MediaElementAudioSourceNode(
        audioContext.current,
        {
          mediaElement: audioElementRef.current,
        }
      );

      gainNode.current = new GainNode(audioContext.current);

      const analyzer = new AudioMotionAnalyzer(visializerContainerRef.current, {
        connectSpeakers: false,
        source: sourceNode.current,
        alphaBars: false,
        ansiBands: false,
        barSpace: 0.25,
        bgAlpha: 0,
        channelLayout: "single",
        colorMode: "gradient",
        fftSize: 16384,
        fillAlpha: 1,
        frequencyScale: "log",
        gradient: "prism",
        ledBars: false,
        linearAmplitude: false,
        linearBoost: 1,
        lineWidth: 0,
        loRes: false,
        lumiBars: false,
        maxDecibels: -25,
        maxFPS: 0,
        maxFreq: 22000,
        minDecibels: -85,
        minFreq: 20,
        mirror: 0,
        mode: 8,
        noteLabels: false,
        outlineBars: false,
        overlay: true,
        peakLine: false,
        radial: false,
        radialInvert: false,
        radius: 0.3,
        reflexAlpha: 0.15,
        reflexBright: 1,
        reflexFit: true,
        reflexRatio: 0,
        roundBars: false,
        showBgColor: true,
        showFPS: false,
        showPeaks: true,
        showScaleX: false,
        showScaleY: false,
        smoothing: 0.5,
        spinSpeed: 0,
        splitGradient: false,
        trueLeds: false,
        useCanvas: true,
        volume: 1,
        weightingFilter: "D",
      });

      analyzer.connectOutput(gainNode.current);
      gainNode.current.connect(audioContext.current.destination);

      isInitialized.current = true;
    }
  }, [
    isInitialized,
    audioElementRef,
    visializerContainerRef,
    audioContext,
    sourceNode,
    gainNode,
  ]);

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
  }, [isPlaying, setIsPlaying]);

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

          <Stack
            direction="row"
            flexShrink={1}
            flexGrow={1}
            spacing={1}
            alignItems="center"
            useFlexGap
          >
            <IconButton size="large" onClick={onPlayClick}>
              {isPlaying ? (
                <PauseIcon fontSize="large" />
              ) : (
                <PlayArrowIcon fontSize="large" />
              )}
            </IconButton>
            <Box ref={visializerContainerRef} width={200} height={20}></Box>
          </Stack>

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

          <UserAvatar />
        </Stack>
      </Container>
    </Box>
  );
}
