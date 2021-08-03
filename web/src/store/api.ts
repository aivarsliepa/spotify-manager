import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from ".";
import * as SharedTypes from "@aivarsliepa/shared";
import { selectJWT } from "./authSlice";

// TODO: make it as env variable
export const API_ROOT = "http://localhost:9000";

export const LOGIN_URL = `${API_ROOT}/auth/spotify`;

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_ROOT,
    prepareHeaders: (headers, { getState }) => {
      const token = selectJWT(getState() as RootState);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: builder => ({
    getAllSongs: builder.query<SharedTypes.GetSongsResponse, void>({
      query: () => `songs?limit=50`, // TODO: this is temporary limit, later it is planned to have some strategy (and query based on labels)
    }),
    getPlaylists: builder.query<SharedTypes.GetPlaylistsResponse, void>({
      query: () => `playlists`,
    }),
    getSongsByPlaylistId: builder.query<SharedTypes.GetSongsResponse, string>({
      query: playlistId => `playlists/${playlistId}`,
    }),
    getSongById: builder.query<SharedTypes.Song, string>({
      query: songId => `songs/${songId}`,
    }),
    getAllLabels: builder.query<SharedTypes.GetLabelsResponse, void>({
      query: () => `labels`,
    }),
    getLabelStatsById: builder.query<SharedTypes.GetLabelStatsResponse, string>({
      query: labelId => `labels/${labelId}/stats`,
    }),
  }),
});

export const {
  useGetAllSongsQuery,
  useGetPlaylistsQuery,
  useGetSongsByPlaylistIdQuery,
  useGetSongByIdQuery,
  useGetAllLabelsQuery,
  useGetLabelStatsByIdQuery,
  useLazyGetLabelStatsByIdQuery,
} = api;

const getRequest = (url: string, jwt: string, searchParams?: Record<string, string>) => {
  if (searchParams) {
    url += `?${new URLSearchParams(searchParams).toString()}`;
  }

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
};

const postRequest = (url: string, body: any, jwt: string) =>
  fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

const patchRequest = (url: string, body: any, jwt: string) =>
  fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

const deleteRequest = (url: string, jwt: string) =>
  fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

export const playSong = createAsyncThunk("apicalls/playSong", async (songId: string, { getState }) => {
  const jwt = selectJWT(getState() as RootState);
  await getRequest(`${API_ROOT}/play-song/${songId}`, jwt);
  return;
});

type ChangeLabelsPayload = { songId: string; labels: string[] };

export const setLabelsToSong = createAsyncThunk("apicalls/changeLabels", async ({ songId, labels }: ChangeLabelsPayload, { getState }) => {
  const jwt = selectJWT(getState() as RootState);
  await patchRequest(`${API_ROOT}/songs/${songId}`, { labels }, jwt);
  return;
});

type CreateLabelPayload = { name: string };
export const createLabel = createAsyncThunk("apicalls/createLabel", async ({ name }: CreateLabelPayload, { getState }) => {
  const jwt = selectJWT(getState() as RootState);
  const response = await postRequest(`${API_ROOT}/labels`, { name }, jwt);
  return (await response.json()) as SharedTypes.Label;
});

export const deleteLabel = createAsyncThunk("apicalls/deleteLabel", async (labelId: String, { getState }) => {
  const jwt = selectJWT(getState() as RootState);
  await deleteRequest(`${API_ROOT}/labels/${labelId}`, jwt);
  return;
});

type UpdateLabelPayload = {
  id: string;
  body: { name: string };
};
export const patchLabel = createAsyncThunk("apicalls/patchLabel", async ({ body, id }: UpdateLabelPayload, { getState }) => {
  const jwt = selectJWT(getState() as RootState);
  const response = await patchRequest(`${API_ROOT}/labels/${id}`, body, jwt);
  return (await response.json()) as SharedTypes.Label;
});

type MergeLabelsPayload = {
  ids: string[];
  name: string;
};
export const mergeLabels = createAsyncThunk("apicalls/patchLabel", async ({ ids, name }: MergeLabelsPayload, { getState }) => {
  const params = { ids: ids.join(","), name };
  const jwt = selectJWT(getState() as RootState);
  await getRequest(`${API_ROOT}/labels/merge`, jwt, params);
  return;
});

export default api;
