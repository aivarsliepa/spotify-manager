import { RequestHandler } from "express";
import * as SharedTypes from "@aivarsliepa/shared";

import { getAccessToken, fetchSongInfo, playSongs } from "../spotify-service";
import { mergeAndPopulateSongData, stringToObjectId, transformSpotifyTrackToData } from "../data/transformers";
import { selectUserSongs } from "../data/queryHelpers";
import { transformAndValideStringLabelIds } from "../data/validationHelpers";
import { chunkArray, numberOrDefault, stringOrDefault } from "../utils";
import { SpotifySongData } from "../data/Song";

/**
 * Fetch info for single song by it's ID
 */
export const getSingleSongInfo: RequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const { songId } = req.params;

    const token = await getAccessToken(user);
    const data = await fetchSongInfo(token, songId);
    const track = data.tracks[0];
    if (!track) {
      return res.status(404).send();
    }

    const spotifySongData = transformSpotifyTrackToData(track);
    const song: SharedTypes.Song = mergeAndPopulateSongData(user, [spotifySongData])[0];

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
    const { includeLabels, excludeLabels, limit, offset } = req.query;

    const exludeValidation = transformAndValideStringLabelIds(user, stringOrDefault(excludeLabels));
    if (!exludeValidation.isValid) {
      console.log("exludeValidation", exludeValidation.isValid);
      return res.status(400).send();
    }

    const includeValidation = transformAndValideStringLabelIds(user, stringOrDefault(includeLabels));
    if (!includeValidation.isValid) {
      console.log("includeValidation", includeValidation.isValid);
      return res.status(400).send();
    }

    const includeLabelsSet = includeValidation.labelHexStrings;
    const excludeLabelsSet = exludeValidation.labelHexStrings;

    const songsFound = selectUserSongs(user, includeLabelsSet, excludeLabelsSet, numberOrDefault(limit), numberOrDefault(offset)).map(
      song => song.spotifyId
    );

    const token = await getAccessToken(user);
    const spotifySongs = await fetchMultipleSongInfoByIds(token, songsFound);
    const songs = mergeAndPopulateSongData(user, spotifySongs);

    const resBody: SharedTypes.GetSongsResponse = { songs };
    res.json(resBody);
  } catch (error) {
    console.error("[getSongs] error getting song info", error);
    res.status(500).send();
  }
};

async function fetchMultipleSongInfoByIds(token: string, ids: string[]): Promise<SpotifySongData[]> {
  const idsChunked = chunkArray(ids, 50).map(idsArr => idsArr.join(","));

  const requests = idsChunked.map(async ids => await fetchSongInfo(token, ids));
  const responseList = await Promise.all(requests);
  const spotifySongs = responseList.map(response => response.tracks.map(transformSpotifyTrackToData)).flat();
  return spotifySongs;
}

/**
 * Play song by ID
 */
export const getPlaySong: RequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const { songId } = req.params;

    const token = await getAccessToken(user);
    const data = await fetchSongInfo(token, songId);

    const [song] = data.tracks;
    await playSongs(token, [song.uri]);

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
