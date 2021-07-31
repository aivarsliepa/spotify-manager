import { RequestHandler } from "express";

import { SongDocument } from "../data/Song";
import { getAccessToken, fetchAllUserSongIds } from "../spotify-service";

// save songs to user which are not already in DB
export const getSync: RequestHandler = async (req, res) => {
  const user = req.user;

  try {
    const token = await getAccessToken(user);
    const spotifyIds = await fetchAllUserSongIds(token);

    let shouldSave = false;
    spotifyIds.forEach(({ spotifyId }) => {
      if (!user.songs.has(spotifyId)) {
        user.songs.set(spotifyId, { spotifyId, labels: [] } as SongDocument);
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
