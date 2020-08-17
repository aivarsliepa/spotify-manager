import { RequestHandler } from "express";
import * as SharedTypes from "@aivarsliepa/shared";

import { UserDocument } from "../models/User";
import { getAccessToken, fetchPlaylistData } from "../spotify-service";

export const getAllPlaylists: RequestHandler = async (req, res) => {
  const user = req.user as UserDocument;

  try {
    const token = await getAccessToken(user);
    const playlists = await fetchPlaylistData(token);

    const resBody: SharedTypes.GetPlaylistsResponse = { playlists };
    res.json(resBody);
  } catch (error) {
    console.error("error getting song info", error);
    res.status(500).send();
  }
};
