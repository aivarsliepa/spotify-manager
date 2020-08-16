import { PlaylistsActionTypes, SET_PLAYLISTS, Playlist } from "./types";

export const setPlaylists = (playlists: Playlist[]): PlaylistsActionTypes => ({ type: SET_PLAYLISTS, payload: playlists });
