import { RequestHandler } from "express";
import * as SharedTypes from "@aivarsliepa/shared";

import { getAccessToken, fetchPlaylistData, fetchPlaylistSongsByPlaylistId } from "../spotify-service";
import { mergeAndPopulateSongData } from "../data/transformers";

export const getAllPlaylists: RequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const token = await getAccessToken(user);
    const playlists = await fetchPlaylistData(token);

    const resBody: SharedTypes.GetPlaylistsResponse = { playlists };
    res.json(resBody);
  } catch (error) {
    console.error("[getAllPlaylists] error getting song info", error);
    res.status(500).send();
  }
};

export const getAllSongsForPlaylist: RequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const { playlistId } = req.params;

    const token = await getAccessToken(user);
    const spotifySongData = await fetchPlaylistSongsByPlaylistId(token, playlistId);
    const songs = mergeAndPopulateSongData(user, spotifySongData);

    const resBody: SharedTypes.GetSongsResponse = { songs };
    res.json(resBody);
  } catch (error) {
    console.error("[getAllSongsForPlaylist] error getting song info", error);
    res.status(500).send();
  }
};
