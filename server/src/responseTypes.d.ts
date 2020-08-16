declare namespace ResponseTypes {
  interface Song {
    spotifyId: string;
    labels: string[];
    name: string;
    artists: string;
  }

  interface Playlist {
    spotifyId: string;
    name: string;
  }

  interface GetSongsResponse {
    songs: Song[];
  }

  interface GetPlaylistsResponse {
    playlists: Playlist[];
  }
}
