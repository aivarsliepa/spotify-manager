import fetch from "node-fetch";
import { URLSearchParams } from "url";

import { UserDocument, SongData } from "./models/User";
import { plusSeconds, createUrlWithParams, wait } from "./utils";
import * as SharedTypes from "@aivarsliepa/shared";

const api = {
  token: "https://accounts.spotify.com/api/token",
  myTracks: "https://api.spotify.com/v1/me/tracks",
  myPlaylists: "https://api.spotify.com/v1/me/playlists",
  tracks: "https://api.spotify.com/v1/tracks",
  play: "https://api.spotify.com/v1/me/player/play",
};

async function refreshToken(user: UserDocument): Promise<string> {
  const refresh_token = user.spotifyRefreshToken;

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token,
  });
  const headers = {
    Authorization: "Basic " + Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString("base64"),
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const res = await fetch(api.token, {
    method: "POST",
    headers,
    body,
  });

  const { access_token, expires_in } = await res.json();

  user.spotifyToken = access_token;
  user.spotifyTokenExpires = plusSeconds(new Date(), expires_in);

  await user.save();

  return access_token;
}

export async function getAccessToken(user: UserDocument): Promise<string> {
  // 1 min window
  if (user.spotifyTokenExpires.getTime() > plusSeconds(new Date(), 60).getTime()) {
    return user.spotifyToken;
  }

  return await refreshToken(user);
}

async function fetchWithRetry<T>(url: string, token: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // too many requests code
  if (res.status === 429 && !Number.isNaN(Number(res.headers.get("Retry-After")))) {
    await wait(+res.headers.get("Retry-After"));
    return await fetchWithRetry(url, token);
  } else if (res.status !== 200) {
    console.log(res.status);
    throw Error(res.statusText);
  }

  return await res.json();
}

// https://developer.spotify.com/web-api/get-users-saved-tracks/
async function fetchUserSavedTracks(token: string, allSongs: Record<string, SongData>): Promise<void> {
  const responses = await fetchAllFromAPI<SpotifyApi.UsersSavedTracksResponse>(api.myTracks, token);
  responses.forEach(response => response.items.map(mapSpotifyTrackToSong).forEach(song => addSongToObject(song, allSongs)));
}

async function fetchSongsFromAllPlaylists(token: string, allSongs: Record<string, SongData>): Promise<void> {
  const playlistResponses = await fetchAllFromAPI<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>(api.myPlaylists, token);

  const requests = playlistResponses.map(async playlistResponse => {
    const songRequests = playlistResponse.items.map(async playlist => await fetchSongsForPlaylist(token, playlist.tracks.href, allSongs));
    return await Promise.all(songRequests);
  });

  await Promise.all(requests);
}

export async function fetchPlaylistData(token: string): Promise<SharedTypes.Playlist[]> {
  const playlists: SharedTypes.Playlist[] = [];

  const playlistResponses = await fetchAllFromAPI<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>(api.myPlaylists, token);
  playlistResponses.map(playlistReponse =>
    playlistReponse.items.map(playlist => playlists.push({ spotifyId: playlist.id, name: playlist.name }))
  );

  return playlists;
}

async function fetchSongsForPlaylist(token: string, href: string, allSongs: Record<string, SongData>): Promise<void> {
  const responses = await fetchAllFromAPI<SpotifyApi.PlaylistTrackResponse>(href, token);
  responses.forEach(response => response.items.map(mapSpotifyTrackToSong).forEach(song => addSongToObject(song, allSongs)));
}

export async function fetchAllUserTracks(token: string): Promise<SongData[]> {
  const songs: Record<string, SongData> = {};

  await Promise.all([fetchUserSavedTracks(token, songs), fetchSongsFromAllPlaylists(token, songs)]);

  return Object.values(songs);
}

export async function fetchSongInfo(token: string, ids: string): Promise<SpotifyApi.MultipleTracksResponse> {
  const url = createUrlWithParams(api.tracks, { ids, market: "from_token" });
  return await fetchWithRetry<SpotifyApi.MultipleTracksResponse>(url, token);
}

export async function playSongs(token: string, uris: string[]): Promise<void> {
  const res = await fetch(api.play, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "PUT",
    body: JSON.stringify({ uris }),
  });

  // TODO: try if RETRY AFTER
  console.log(res.status);
  console.log(res.statusText);
  // console.log(await res.json());
}

export async function fetchAllFromAPI<T extends { total: number }>(apiUrl: string, token: string): Promise<T[]> {
  // need to make first request to see the total number of items -> `response.body.total`
  const url = createUrlWithParams(apiUrl, { limit: "50" });
  const firstRequestBody = await fetchWithRetry<T>(url, token);

  // prepare requests for the rest of the playlists
  const urls: string[] = [];
  for (let i = 50; i < firstRequestBody.total; i += 50) {
    urls.push(createUrlWithParams(apiUrl, { limit: "50", offset: i.toString() }));
  }

  const requests = urls.map(url => fetchWithRetry<T>(url, token));
  const restOfRequests = await Promise.all(requests);

  return [firstRequestBody, ...restOfRequests];
}

function addSongToObject(song: SongData, object: Record<string, SongData>) {
  object[song.spotifyId] = song;
}

function mapSpotifyTrackToSong({ track }: { track: SpotifyApi.TrackObjectFull }): SongData {
  return {
    spotifyId: track.id,
    labels: [],
  };
}
