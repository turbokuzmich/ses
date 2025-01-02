import { type MusicUpload } from "@/lib/schemas";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PlayerState = {
  isReady: boolean;
  isPlaying: boolean;
  gain: number;
  track?: MusicUpload;
};

const initialState: PlayerState = {
  isReady: false,
  isPlaying: false,
  gain: 80,
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setIsReady(state) {
      state.isReady = true;
    },
    play(state, { payload: track }: PayloadAction<MusicUpload>) {
      state.track = track;
      state.isPlaying = true;
    },
    pause(state) {
      state.isPlaying = false;
    },
    resume(state) {
      if (state.track) {
        state.isPlaying = true;
      }
    },
    setGain(state, { payload: gain }: PayloadAction<number>) {
      state.gain = gain;
    },
  },
});
