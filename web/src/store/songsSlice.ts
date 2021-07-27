import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from ".";
import { Song } from "../../../shared";

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
