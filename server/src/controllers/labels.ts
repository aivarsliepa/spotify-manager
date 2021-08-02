import { RequestHandler } from "express";
import * as SharedTypes from "@aivarsliepa/shared";

import { transformLabelDocToData } from "../data/transformers";
import { Types } from "mongoose";
import { transformAndValideStringLabelIds } from "../data/validationHelpers";

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

// TODO: this is very inefficient, might need to restructure data to make it efficient
// one possibility is to store the number of song on the label itself
export const getLabelStats: RequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const { labelId } = req.params;

    const id = Types.ObjectId(labelId);

    let numberOfSongs = 0;
    user.songs.forEach(song => {
      for (const label of song.labels) {
        if (id.equals(label)) {
          numberOfSongs++;
        }
      }
    });

    const resBody: SharedTypes.GetLabelStatsResponse = { numberOfSongs };

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

export const deleteLabelById: RequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const { labelId } = req.params;

    if (!labelId) {
      return res.status(404).send();
    }

    const labelObjectId = Types.ObjectId(labelId);
    const label = user.labels.id(labelObjectId);
    if (!label) {
      return res.status(404).send();
    }

    user.labels.remove(label);
    user.songs.forEach(song => {
      song.labels = song.labels.filter(label => !label.equals(labelObjectId));
    });

    await user.save();

    res.send();
  } catch (error) {
    console.error("[getAllPlaylists] error getting song info", error);
    res.status(500).send();
  }
};

export const patchLabelById: RequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const { labelId } = req.params;
    const { name } = req.body;

    if (!labelId) {
      return res.status(404).send();
    }

    const labelObjectId = Types.ObjectId(labelId);
    const label = user.labels.id(labelObjectId);
    if (!label) {
      return res.status(404).send();
    }

    label.name = name;
    await user.save();

    res.send();
  } catch (error) {
    console.error("[getAllPlaylists] error getting song info", error);
    res.status(500).send();
  }
};

/* 
  "Merge labels"
    params:
      ids - list of IDs that need to be merged
      name - name of final label
    
  Behind the scenes it actually deletes all labels and creates a new one with given name.

*/
export const getMergeLabels: RequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const { ids, name } = req.query;
    if (!(ids && name)) {
      return res.status(400).send();
    }

    const validation = transformAndValideStringLabelIds(user, String(ids));
    if (!validation.isValid) {
      return res.status(400).send();
    }

    const idsToRemoveSet = validation.labelHexstrings;

    // to merge, need at least 2
    if (idsToRemoveSet.size < 2) {
      return res.status(400).send();
    }

    const newLabel = user.labels.create({ name });

    user.songs.forEach(song => {
      let shouldAddNewLabel = false;
      song.labels = song.labels.filter(label => {
        if (idsToRemoveSet.has(label.toHexString())) {
          shouldAddNewLabel = true;
          return false;
        }

        return true;
      });

      if (shouldAddNewLabel) {
        song.labels.push(newLabel.id);
      }
    });

    user.labels.push(newLabel);
    for (const labelId of idsToRemoveSet) {
      user.labels.id(Types.ObjectId(labelId)).remove();
    }

    await user.save();

    res.send();
  } catch (error) {
    console.error("[getAllPlaylists] error getting song info", error);
    res.status(500).send();
  }
};
