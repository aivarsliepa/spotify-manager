import { RequestHandler } from "express";

import { createNewSong } from "../data/Song";
import { getAccessToken, fetchPlaylistData, fetchUserSavedTracks, fetchPlaylistSongsByPlaylistId } from "../spotify-service";

// fetch playlists, saved tracks and playlist/track relation from Spotify API
export const getSync: RequestHandler = async (req, res) => {
  try {
    const user = req.user;
    const token = await getAccessToken(user);

    // 1. get all playlists -> store them
    const playlists = await fetchPlaylistData(token);

    // 2. get saved tracks
    const savedTracks = await fetchUserSavedTracks(token);

    // 3. fetch songs for playlists and add playlist id to user.songs[].playlists
    const playlistTrackPromises = playlists.map(async playlist => {
      const playlistTracks = await fetchPlaylistSongsByPlaylistId(token, playlist.spotifyId);
      for (const track of playlistTracks) {
        if (!user.songs.has(track.spotifyId)) {
          user.songs.set(track.spotifyId, createNewSong(track));
        }

        user.songs.get(track.spotifyId).playlists.push(playlist.spotifyId);
      }
    });

    // 4. process data while fetching playlists
    // 4.1 clean old data
    user.playlists.splice(0);
    user.songs.forEach(song => {
      song.isSaved = false;
      song.playlists.splice(0);
    });

    // 4.2. create new playlists
    user.playlists.push(...playlists);

    // 4.3. process saved tracks
    for (const track of savedTracks) {
      if (!user.songs.has(track.spotifyId)) {
        user.songs.set(track.spotifyId, createNewSong(track));
      }

      user.songs.get(track.spotifyId).isSaved = true;
    }

    await Promise.all(playlistTrackPromises);

    await user.save();

    res.send();
  } catch (error) {
    console.log("[getSync] error syncing", error);
    res.status(500).send();
  }
};
