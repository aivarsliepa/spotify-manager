import { store } from "./store";
import * as SharedTypes from "@aivarsliepa/shared";

// TODO: make it as env variable
const API_ROOT = "http://localhost:9000";

// TODO: error handling !!
// some top level error handling (e.g. when there is a crash in request handler, it is not handeled correctly)

export const LOGIN_URL = `${API_ROOT}/auth/spotify`;

const getRequest = (url: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${store.getState().auth.jwt}`,
    },
  });

const postRequest = (url: string, body: any) =>
  fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${store.getState().auth.jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

export const fetchSongs = async (): Promise<SharedTypes.GetSongsResponse> => {
  const res = await getRequest(`${API_ROOT}/get-all-songs`);
  return await res.json();
};

// export const fetchSongInfo = async (songId: string) => {
//   const res = await getRequest(`${API_ROOT}/songInfo/${songId}`);
//   return await res.json();
// };

export const fetchPlaylists = async (): Promise<SharedTypes.GetPlaylistsResponse> => {
  const res = await getRequest(`${API_ROOT}/playlists`);
  return await res.json();
};

export const fetchSongsForPlaylist = async (playlistId: string): Promise<SharedTypes.GetSongsResponse> => {
  const res = await getRequest(`${API_ROOT}/playlists/${playlistId}`);
  return await res.json();
};

export const playSong = async (songId: string) => {
  return await getRequest(`${API_ROOT}/play-song/${songId}`);
};

export const changeLabels = async (songId: string, labels: string[]) => {
  return await postRequest(`${API_ROOT}/song/${songId}`, { labels });
};
