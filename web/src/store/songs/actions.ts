import { SongsActionTypes, SET_SONGS, Song } from "./types";

export const setSongs = (songs: Song[]): SongsActionTypes => ({ type: SET_SONGS, payload: songs });
