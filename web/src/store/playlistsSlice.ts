import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from ".";

// TODO maybe different place to define this?
export interface Playlist {
  spotifyId: string;
  name: string;
}

interface PlaylistState {
  playlists: Playlist[];
}

const initialState: PlaylistState = {
  playlists: [],
};

export const slice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    setPlaylists(state, action: PayloadAction<Playlist[]>) {
      state.playlists = action.payload;
    },
  },
});

export const { setPlaylists } = slice.actions;

export const selectPlaylists = (state: RootState) => state.playlists.playlists;

export default slice.reducer;
