import { RequestHandler } from "express";
import * as SharedTypes from "@aivarsliepa/shared";

import { getAccessToken, playSongs } from "../spotify-service";
import { stringToObjectId, transformSongDocumentToSharedSong } from "../data/transformers";
import { selectSongsByLabels, selectSongsByPlaylistId } from "../data/queryHelpers";
import { isPlaylistSpotifyIdValid, transformAndValideStringLabelIds } from "../data/validationHelpers";
import { numberOrDefault, stringOrDefault } from "../utils";

/**
 * Fetch info for single song by it's ID
 */
export const getSingleSongInfo: RequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const { songId } = req.params;

    const songDocument = user.songs.get(songId);
    if (!songDocument) {
      return res.status(404).send();
    }

    // TODO: share type of response body
    const song: SharedTypes.Song = transformSongDocumentToSharedSong(songDocument);
    res.json(song);
  } catch (error) {
    console.error("[getSingleSongInfo] error getting song info", error);
    res.status(500).send();
  }
};

/**
 * Fetch song info, song ids are taken from database, info fetched from Spotify API
 * Songs can be filtered based in labels to be included and labesl to be excluded.
 * params:
      includeLabels - list of label IDs
      excludeLabels - list of label IDs
    
 */
export const getSongs: RequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const { includeLabels, excludeLabels, limit, offset, playlistId } = req.query;

    const queryLimit = numberOrDefault(limit);
    const queryOffset = numberOrDefault(offset);

    if (queryLimit < 0 || queryOffset < 0) {
      return res.status(400).send();
    }

    const exludeValidation = transformAndValideStringLabelIds(user, stringOrDefault(excludeLabels));
    if (!exludeValidation.isValid) {
      return res.status(400).send();
    }

    const includeValidation = transformAndValideStringLabelIds(user, stringOrDefault(includeLabels));
    if (!includeValidation.isValid) {
      return res.status(400).send();
    }

    const playlistSpotifyId = stringOrDefault(playlistId);
    let songDocs = Array.from(user.songs.values());

    if (playlistSpotifyId) {
      if (!isPlaylistSpotifyIdValid(user, playlistSpotifyId)) {
        return res.status(400).send();
      }

      songDocs = selectSongsByPlaylistId(songDocs, playlistSpotifyId);
    }

    const includeLabelsSet = includeValidation.labelHexStrings;
    const excludeLabelsSet = exludeValidation.labelHexStrings;

    const songs = selectSongsByLabels(songDocs, includeLabelsSet, excludeLabelsSet, numberOrDefault(limit), numberOrDefault(offset)).map(
      transformSongDocumentToSharedSong
    );

    const resBody: SharedTypes.GetSongsResponse = { songs };
    res.json(resBody);
  } catch (error) {
    console.error("[getSongs] error getting song info", error);
    res.status(500).send();
  }
};

/**
 * Play song by ID
 */
export const getPlaySongById: RequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const { songId } = req.params;

    const songDocument = user.songs.get(songId);
    if (!songDocument) {
      return res.status(404).send();
    }

    const token = await getAccessToken(user);
    await playSongs(token, [songDocument.uri]);

    res.send();
  } catch (error) {
    console.error("[getPlaySong] error getting song info", error);
    res.status(500).send();
  }
};

/**
 * Save labels for song
 */
export const postSong: RequestHandler = async (req, res) => {
  // TODO: should be PATCH method, might need to change different url and to support multiple songs, something like = /songs/add/label?songIds=1,2,3&labelId=4

  try {
    const user = req.user;
    const { songId } = req.params;
    const { labels } = req.body;

    if (!labels) {
      console.error("[postSong] no labels provided");
      return res.status(400).send();
    }

    const storedSong = user.songs.get(songId);
    if (!storedSong) {
      console.error("[postSong] no song found");
      return res.status(404).send();
    }

    storedSong.labels = labels.map(stringToObjectId);

    await user.save();
    res.send();
  } catch (error) {
    console.error("[postSong] error updating labels", error);
    res.status(500).send();
  }
};
