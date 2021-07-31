import fetch from "node-fetch";
import { URLSearchParams } from "url";
import * as SharedTypes from "@aivarsliepa/shared";

import { UserDocument } from "./data/User";
import { plusSeconds, createUrlWithParams, wait } from "./utils";
import { trackToSpotifyIdObject, transformSpotifyTrackToData } from "./data/transformers";
import { SpotifySongData } from "./data/Song";

const apiURLs = Object.freeze({
  token: "https://accounts.spotify.com/api/token",
  myTracks: "https://api.spotify.com/v1/me/tracks",
  myPlaylists: "https://api.spotify.com/v1/me/playlists",
  tracks: "https://api.spotify.com/v1/tracks",
  play: "https://api.spotify.com/v1/me/player/play",
  playlistTracks: (playlistId: string) => `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
});

const marketParam = Object.freeze({
  market: "from_token",
});

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

  const res = await fetch(apiURLs.token, {
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
async function fetchUserSavedTracks(token: string, allSongs: Record<string, SharedTypes.SpotifyIdObject>): Promise<void> {
  const responses = await fetchAllFromAPI<SpotifyApi.UsersSavedTracksResponse>(apiURLs.myTracks, token);
  responses.forEach(response =>
    response.items.map(item => trackToSpotifyIdObject(item.track)).forEach(song => (allSongs[song.spotifyId] = song))
  );
}

export async function fetchPlaylistData(token: string): Promise<SharedTypes.Playlist[]> {
  const playlists: SharedTypes.Playlist[] = [];

  const playlistResponses = await fetchAllFromAPI<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>(apiURLs.myPlaylists, token);
  playlistResponses.forEach(playlistReponse =>
    playlistReponse.items.forEach(playlist => playlists.push({ spotifyId: playlist.id, name: playlist.name }))
  );

  return playlists;
}

export async function fetchAllUserSongIds(token: string): Promise<SharedTypes.SpotifyIdObject[]> {
  const allSongs: Record<string, SharedTypes.SpotifyIdObject> = {};

  await Promise.all([fetchUserSavedTracks(token, allSongs), fetchSongsFromAllPlaylists(token, allSongs)]);

  return Object.values(allSongs);
}

export async function fetchSongInfo(token: string, ids: string): Promise<SpotifyApi.MultipleTracksResponse> {
  const url = createUrlWithParams(apiURLs.tracks, { ids, ...marketParam });
  return await fetchWithRetry<SpotifyApi.MultipleTracksResponse>(url, token);
}

export async function playSongs(token: string, uris: string[]): Promise<void> {
  const res = await fetch(apiURLs.play, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "PUT",
    body: JSON.stringify({ uris }),
  });

  // TODO: try if RETRY AFTER
  console.log(res.status);
  console.log(res.statusText);
}

export async function fetchAllFromAPI<T extends { total: number }>(
  apiUrl: string,
  token: string,
  params: Record<string, string> = {}
): Promise<T[]> {
  // need to make first request to see the total number of items -> `response.body.total`
  const url = createUrlWithParams(apiUrl, { limit: "50", ...params });
  const firstRequestBody = await fetchWithRetry<T>(url, token);

  // prepare requests for the rest of the playlists
  const urls: string[] = [];
  for (let i = 50; i < firstRequestBody.total; i += 50) {
    urls.push(createUrlWithParams(apiUrl, { limit: "50", offset: i.toString(), ...params }));
  }

  const requests = urls.map(url => fetchWithRetry<T>(url, token));
  const restOfRequests = await Promise.all(requests);

  return [firstRequestBody, ...restOfRequests];
}

/// =========== Playlists ============ ///
async function fetchSongsFromAllPlaylists(token: string, allSongs: Record<string, SharedTypes.SpotifyIdObject>): Promise<void> {
  const playlistResponses = await fetchAllFromAPI<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>(apiURLs.myPlaylists, token);

  const requests = playlistResponses.map(async playlistResponse => {
    const songRequests = playlistResponse.items.map(async playlist => {
      const tracks = await fetchAllPlaylistTracks(token, playlist.tracks.href);
      tracks.map(track => trackToSpotifyIdObject(track.track)).forEach(song => (allSongs[song.spotifyId] = song));
    });
    return await Promise.all(songRequests);
  });

  await Promise.all(requests);
}

export async function fetchPlaylistSongsByPlaylistId(token: string, playlistId: string): Promise<SpotifySongData[]> {
  const url = apiURLs.playlistTracks(playlistId);
  const tracks = await fetchAllPlaylistTracks(token, url);

  return tracks.map(item => transformSpotifyTrackToData(item.track));
}

async function fetchAllPlaylistTracks(token: string, href: string): Promise<SpotifyApi.PlaylistTrackObject[]> {
  const responses = await fetchAllFromAPI<SpotifyApi.PlaylistTrackResponse>(href, token, marketParam);
  return responses.map(reponse => reponse.items).flat();
}
