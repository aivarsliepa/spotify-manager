import { RequestHandler } from "express";
import * as SharedTypes from "@aivarsliepa/shared";

import { UserDocument } from "../models/User";
import { getAccessToken, fetchPlaylistData, fetchAllSongsForPlaylist } from "../spotify-service";

export const getAllPlaylists: RequestHandler = async (req, res) => {
  const user = req.user as UserDocument;

  try {
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
  const user = req.user as UserDocument;
  const { playlistId } = req.params;

  try {
    const token = await getAccessToken(user);
    const songs = await fetchAllSongsForPlaylist(token, playlistId);
    const populatedSongs = songs.map(song => {
      song.labels = user.songs.get(song.spotifyId).labels;
      return song;
    });

    const resBody: SharedTypes.GetSongsResponse = { songs: populatedSongs };
    res.json(resBody);
  } catch (error) {
    console.error("[getAllSongsForPlaylist] error getting song info", error);
    res.status(500).send();
  }
};
