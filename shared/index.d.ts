export interface SpotifyIdObject {
  spotifyId: string;
}

export interface Song extends SpotifyIdObject {
  labelIds: string[];
  name: string;
  artists: string;
}

export interface Playlist extends SpotifyIdObject {
  name: string;
}

export interface GetSongsResponse {
  songs: Song[];
}

export interface GetPlaylistsResponse {
  playlists: Playlist[];
}
export interface Label {
  name: string;
  id: string;
}

export interface GetLabelsResponse {
  labels: Label[];
}

export interface GetLabelStatsResponse {
  numberOfSongs: number;
}
