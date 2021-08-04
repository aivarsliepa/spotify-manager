import fetch from "node-fetch";
import { URLSearchParams } from "url";
import * as SharedTypes from "@aivarsliepa/shared";

import { UserDocument } from "./data/User";
import { plusSeconds, createUrlWithParams, wait } from "./utils";
import { transformSpotifyPlaylistToData, transformSpotifyTrackToData } from "./data/transformers";
import { SpotifySongData } from "./data/Song";

const apiConfig = {
  // tracks: "https://api.spotify.com/v1/tracks",
  token: "https://accounts.spotify.com/api/token",
  myTracks: {
    url: "https://api.spotify.com/v1/me/tracks",
    params: {
      limit: "50",
    },
  },
  myPlaylists: {
    url: "https://api.spotify.com/v1/me/playlists",
    params: {
      limit: "50",
    },
  },
  play: "https://api.spotify.com/v1/me/player/play",
  playlistTracks: {
    buildURL: (playlistId: string) => `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    params: {
      limit: "100",
      market: "from_token",
      fields: "total,limit,items(track(images,linked_from,id,name,uri,album(images),artists(name)))",
    },
  },
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

  const res = await fetch(apiConfig.token, {
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

export async function fetchUserSavedTracks(token: string): Promise<SpotifySongData[]> {
  const { url, params } = apiConfig.myTracks;
  const responses = await fetchAllFromAPI<SpotifyApi.UsersSavedTracksResponse>(url, token, params);
  return responses.map(response => response.items.map(item => transformSpotifyTrackToData(item.track))).flat();
}

export async function fetchPlaylistData(token: string): Promise<SharedTypes.Playlist[]> {
  const { url, params } = apiConfig.myPlaylists;
  const playlistResponses = await fetchAllFromAPI<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>(url, token, params);
  return playlistResponses.map(playlistReponse => playlistReponse.items.map(transformSpotifyPlaylistToData)).flat();
}

export async function playSongs(token: string, uris: string[]): Promise<void> {
  // const res =
  await fetch(apiConfig.play, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: "PUT",
    body: JSON.stringify({ uris }),
  });

  // TODO: error handling !
  // const resBody = await res.json();
  // console.log(res.status);
  // console.log(res.statusText);
  // console.log(resBody);
}

export async function fetchAllFromAPI<T extends { total: number; limit: number }>(
  apiUrl: string,
  token: string,
  params: Record<string, string> = {}
): Promise<T[]> {
  // need to make first request to see the total number of items -> `response.body.total`
  const url = createUrlWithParams(apiUrl, { ...params });
  const firstRequestBody = await fetchWithRetry<T>(url, token);

  // prepare requests for the rest of the playlists
  const urls: string[] = [];
  for (let i = firstRequestBody.limit; i < firstRequestBody.total; i += firstRequestBody.limit) {
    urls.push(createUrlWithParams(apiUrl, { offset: i.toString(), ...params }));
  }

  const requests = urls.map(url => fetchWithRetry<T>(url, token));
  const restOfRequests = await Promise.all(requests);

  return [firstRequestBody, ...restOfRequests];
}

export async function fetchPlaylistSongsByPlaylistId(token: string, playlistId: string): Promise<SpotifySongData[]> {
  const url = apiConfig.playlistTracks.buildURL(playlistId);
  const responses = await fetchAllFromAPI<SpotifyApi.PlaylistTrackResponse>(url, token, apiConfig.playlistTracks.params);
  return responses
    .map(reponse => reponse.items)
    .flat()
    .map(item => transformSpotifyTrackToData(item.track));
}
