export interface Song {
  spotifyId: string;
  labels: string[];
  name: string;
  artists: string;
}

export interface Playlist {
  spotifyId: string;
  name: string;
}

export interface GetSongsResponse {
  songs: Song[];
}

export interface GetPlaylistsResponse {
  playlists: Playlist[];
}
export type Label = string;

export interface GetLabelsResponse {
  labels: Label[];
}
