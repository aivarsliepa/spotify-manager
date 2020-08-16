export const SET_PLAYLISTS = "SET_PLAYLISTS";

export interface Playlist {
  spotifyId: string;
  name: string;
}

export interface PlaylistState {
  playlists: Playlist[];
}

interface SetPlaylistsAction {
  type: typeof SET_PLAYLISTS;
  payload: Playlist[];
}

export type PlaylistsActionTypes = SetPlaylistsAction;
