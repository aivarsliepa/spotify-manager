import { Reducer } from "redux";

import { PlaylistState, PlaylistsActionTypes, SET_PLAYLISTS } from "./types";

const initialState: PlaylistState = {
  playlists: [],
};

export const playlistReducer: Reducer<PlaylistState, PlaylistsActionTypes> = (state = initialState, action): PlaylistState => {
  switch (action.type) {
    case SET_PLAYLISTS:
      return { ...state, playlists: [...action.payload] };
    default:
      return state;
  }
};
