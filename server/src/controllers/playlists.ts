import { RequestHandler } from "express";
import * as SharedTypes from "@aivarsliepa/shared";

import { transformPlaylistDocToData, transformSongDocumentToSharedSong } from "../data/transformers";
import { selectSongsByPlaylistId } from "../data/queryHelpers";

export const getAllPlaylists: RequestHandler = async (req, res) => {
  try {
    const playlists = req.user.playlists.map(transformPlaylistDocToData);
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

    const songs = selectSongsByPlaylistId([...user.songs.values()], playlistId).map(transformSongDocumentToSharedSong);

    const resBody: SharedTypes.GetSongsResponse = { songs };
    res.json(resBody);
  } catch (error) {
    console.error("[getAllSongsForPlaylist] error getting song info", error);
    res.status(500).send();
  }
};
