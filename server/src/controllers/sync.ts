import { RequestHandler } from "express";

import { UserDocument, SongDocument } from "../models/User";
import { getAccessToken, fetchAllUserTracks } from "../spotify-service";

// save songs to user which are not already in DB
export const getSync: RequestHandler = async (req, res) => {
  const user = req.user as UserDocument;

  try {
    const token = await getAccessToken(user);
    const tracks = await fetchAllUserTracks(token);

    let shouldSave = false;
    tracks.forEach(track => {
      if (!user.songs.has(track.spotifyId)) {
        user.songs.set(track.spotifyId, track as SongDocument);
        shouldSave = true;
      }
    });

    if (shouldSave) {
      await user.save();
    }

    res.send();
  } catch (error) {
    console.log("[getSync] error syncing", error);
    res.status(500).send();
  }
};
