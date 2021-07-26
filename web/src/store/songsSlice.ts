import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from ".";

// TODO maybe different place to define this?
export interface Song {
  spotifyId: string;
  labels: string[];
  name: string;
  artists: string;
}

interface SongState {
  songs: Song[];
}

const initialState: SongState = {
  songs: [],
};

export const slice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    setSongs(state, action: PayloadAction<Song[]>) {
      state.songs = action.payload;
    },
  },
});

export const { setSongs } = slice.actions;

export const selectSongs = (state: RootState) => state.songs.songs;

export default slice.reducer;
