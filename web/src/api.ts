import { store } from "./store";
import { Song } from "./store/songs/types";
import { Playlist } from "./store/playlists/types";

// TODO: make it as env variable
const API_ROOT = "http://localhost:9000";

export const LOGIN_URL = `${API_ROOT}/auth/spotify`;

const getRequest = (url: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${store.getState().auth.jwt}`,
    },
  });

// TODO shared types
export const fetchSongs = async (): Promise<{ songs: Song[] }> => {
  const res = await getRequest(`${API_ROOT}/get-all-songs`);
  return await res.json();
};

export const fetchSongInfo = async (id: string) => {
  const res = await getRequest(`${API_ROOT}/songInfo/${id}`);
  return await res.json();
};

export const fetchPlaylists = async (): Promise<{ playlists: Playlist[] }> => {
  const res = await getRequest(`${API_ROOT}/playlists`);
  return await res.json();
};
