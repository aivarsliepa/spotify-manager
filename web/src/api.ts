import { store } from "./store";

// TODO: make it as env variable
const API_ROOT = "http://localhost:9000";

export const LOGIN_URL = `${API_ROOT}/auth/spotify`;

export const fetchSongs = async () => {
  const jwt = store.getState().auth.jwt;

  const url = `${API_ROOT}/get-all-songs`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  });

  return await res.json();
};

export const fetchSongInfo = async (id: string) => {
  const jwt = store.getState().auth.jwt;

  const url = `${API_ROOT}/songInfo/${id}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  });

  return await res.json();
};
