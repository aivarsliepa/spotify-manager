import { store } from "./store";
import * as SharedTypes from "@aivarsliepa/shared";

// TODO: make it as env variable
const API_ROOT = "http://localhost:9000";

export const LOGIN_URL = `${API_ROOT}/auth/spotify`;

const getRequest = (url: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${store.getState().auth.jwt}`,
    },
  });

export const fetchSongs = async (): Promise<SharedTypes.GetSongsResponse> => {
  const res = await getRequest(`${API_ROOT}/get-all-songs`);
  return await res.json();
};

export const fetchSongInfo = async (songId: string) => {
  const res = await getRequest(`${API_ROOT}/songInfo/${songId}`);
  return await res.json();
};

export const fetchPlaylists = async (): Promise<SharedTypes.GetPlaylistsResponse> => {
  const res = await getRequest(`${API_ROOT}/playlists`);
  return await res.json();
};

export const fetchSongsForPlaylist = async (playlistId: string): Promise<SharedTypes.GetSongsResponse> => {
  const res = await getRequest(`${API_ROOT}/playlists/${playlistId}`);
  return await res.json();
};
