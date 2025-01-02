import { createSelector } from "@reduxjs/toolkit";
import { type RootState } from "..";

export const selectPlayer = (state: RootState) => state.player;
export const selectIsPlaying = createSelector(
  selectPlayer,
  (player) => player.isPlaying
);
export const selectIsReady = createSelector(
  selectPlayer,
  (player) => player.isReady
);
export const selectGain = createSelector(selectPlayer, (player) => player.gain);
export const selectTrack = createSelector(
  selectPlayer,
  (player) => player.track
);
