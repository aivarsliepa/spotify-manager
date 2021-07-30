import { RequestHandler } from "express";
import * as SharedTypes from "@aivarsliepa/shared";

import { UserDocument } from "../models/User";

export const getAllLabels: RequestHandler = async (req, res) => {
  const user = req.user as UserDocument;

  try {
    const labels = new Set<string>();
    // TODO: optimize?
    for (const song of user.songs.values()) {
      song.labels.forEach(label => labels.add(label));
    }

    const resBody: SharedTypes.GetLabelsResponse = { labels: [...labels] };
    res.json(resBody);
  } catch (error) {
    console.error("[getAllPlaylists] error getting song info", error);
    res.status(500).send();
  }
};
