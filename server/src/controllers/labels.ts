import { RequestHandler } from "express";
import * as SharedTypes from "@aivarsliepa/shared";

import { transformLabelDocToData } from "../data/transformers";

export const getAllLabels: RequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const labels = user.labels.map(transformLabelDocToData);
    const resBody: SharedTypes.GetLabelsResponse = { labels };

    res.json(resBody);
  } catch (error) {
    console.error("[getAllPlaylists] error getting song info", error);
    res.status(500).send();
  }
};

export const postCreateNewLabel: RequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const { name } = req.body;

    if (!name) {
      return res.status(400).send();
    }

    const labelDocument = user.labels.create({ name });
    user.labels.push(labelDocument);

    await user.save();

    const resBody: SharedTypes.Label = { name, id: labelDocument.id };
    res.send(resBody);
  } catch (error) {
    console.error("[getAllPlaylists] error getting song info", error);
    res.status(500).send();
  }
};
