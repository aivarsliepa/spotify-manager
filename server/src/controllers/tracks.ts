import { RequestHandler } from "express";
import * as SharedTypes from "@aivarsliepa/shared";

import { getAccessToken, fetchSongInfo, playSongs } from "../spotify-service";
import { mergeAndPopulateSongData, stringToObjectId, transformSpotifyTrackToData } from "../data/transformers";

export const getMutlipleSongsInfo: RequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const { ids } = req.query;
    // TODO have a better handling of query strings, etc.. (probably some utility function to extract them)

    const token = await getAccessToken(user);
    const data = await fetchSongInfo(token, String(ids));

    res.json(data);
  } catch (error) {
    console.error("[getMutlipleSongsInfo] error getting song info", error);
    res.status(500).send();
  }
};

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
 * Fetch song info (max 50 songs), song ids are taken from database, info fetched from Spotify API
 */
export const getSongs: RequestHandler = async (req, res) => {
  try {
    const user = req.user;
    let { limit = 50, offset = 0 } = req.query;
    // TODO have a better handling of query strings, etc.. (probably some utility function to extract them)
    limit = Number(limit);
    offset = Number(offset);

    const songsInRange = [...user.songs.values()].slice(offset, offset + limit);
    const ids: string = songsInRange.map(song => song.spotifyId).join(",");

    const token = await getAccessToken(user);
    const tracks = await fetchSongInfo(token, ids);

    const spotifySongDataList = tracks.tracks.map(transformSpotifyTrackToData);
    const songs = mergeAndPopulateSongData(user, spotifySongDataList);

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
