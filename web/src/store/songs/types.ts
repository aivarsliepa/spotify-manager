export const SET_SONGS = "SET_SONGS";

export interface Song {
  spotifyId: string;
  labels: string[];
  name: string;
  artists: string;
}

export interface SongState {
  songs: Song[];
}

interface SetSongsAction {
  type: typeof SET_SONGS;
  payload: Song[];
}

export type SongsActionTypes = SetSongsAction;
