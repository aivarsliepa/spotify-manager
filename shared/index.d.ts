export interface SpotifyIdObject {
  spotifyId: string;
}

export interface Song extends SpotifyIdObject {
  name: string;
  isSaved: boolean;
  playlistIds: string[];
  labelIds: string[];
  artists: string[];
  image: string;
}

export interface Playlist extends SpotifyIdObject {
  name: string;
  image: string;
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
