import { RequestHandler } from "express";
import * as SharedTypes from "@aivarsliepa/shared";

import { UserDocument, SongData } from "../models/User";
import { getAccessToken, fetchSongInfo, playSongs, mapSpotifyTrackToSharedSong } from "../spotify-service";

export const getMutlipleSongsInfo: RequestHandler = async (req, res) => {
  const user = req.user as UserDocument;

  const { ids } = req.query;
  // TODO have a better handling of query strings, etc.. (probably some utility function to extract them)

  try {
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
  const user = req.user as UserDocument;
  const { songId } = req.params;

  try {
    const token = await getAccessToken(user);
    const data = await fetchSongInfo(token, songId);
    const track = data.tracks[0];
    if (!track) {
      return res.status(404).send();
    }

    const song = mapSpotifyTrackToSharedSong({ track });
    const storedSong = user.songs.get(songId);
    if (storedSong) {
      song.labels = storedSong.labels;
    }

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
  const user = req.user as UserDocument;
  let { limit = 50, offset = 0 } = req.query;
  // TODO have a better handling of query strings, etc.. (probably some utility function to extract them)
  limit = Number(limit);
  offset = Number(offset);
  const songs = [...user.songs.values()].slice(offset, offset + limit);

  const ids: string = songs.map(song => song.spotifyId).join(",");

  const songMap: Record<string, SongData> = {};

  for (const song of songs) {
    const { labels, spotifyId }: SongData = song.toObject();
    songMap[spotifyId] = { labels, spotifyId };
  }

  try {
    const token = await getAccessToken(user);
    const data = await fetchSongInfo(token, ids);

    const songRes: SharedTypes.Song[] = data.tracks.map(track => {
      const artists = track.artists.map(artist => artist.name).join(", ");
      const id = track.linked_from?.id ?? track.id;
      const song = songMap[id];

      const { labels, spotifyId } = song;
      return { labels, spotifyId, name: track.name, artists };
    });

    const resBody: SharedTypes.GetSongsResponse = { songs: songRes };
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
  const user = req.user as UserDocument;
  const { songId } = req.params;

  try {
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
  const user = req.user as UserDocument;
  const { songId } = req.params;
  const { labels } = req.body;
  if (!labels) {
    console.error("[postSong] no labels provided");
    return res.status(400).send();
  }

  try {
    // TODO: can be optimized by using mongo driver for update
    // for (const song in user.songs) {

    // }

    user.songs.forEach(song => {
      if (song.spotifyId === songId) {
        song.labels = labels;
      }
    });

    await user.save();
    res.send();
  } catch (error) {
    console.error("[postSong] error updating labels", error);
    res.status(500).send();
  }
};
