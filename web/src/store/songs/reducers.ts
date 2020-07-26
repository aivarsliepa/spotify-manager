import { Reducer } from "redux";

import { SongState, SongsActionTypes, SET_SONGS } from "./types";

const initialState: SongState = {
  songs: []
};

export const songsReducer: Reducer<SongState, SongsActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case SET_SONGS:
      return { ...state, songs: [...action.payload] };
    default:
      return state;
  }
};
