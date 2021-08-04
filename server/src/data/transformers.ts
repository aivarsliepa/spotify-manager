import * as SharedTypes from "@aivarsliepa/shared";
import { Types } from "mongoose";

import { LabelDocument } from "./Label";
import { PlaylistDocument } from "./Playlist";
import { SongDocument, SpotifySongData } from "./Song";

const trackToSpotifyIdObject = (track: SpotifyApi.TrackObjectFull): SharedTypes.SpotifyIdObject => ({
  spotifyId: track.linked_from?.id ?? track.id,
});

export const transformLabelDocToData = ({ name, id }: LabelDocument): SharedTypes.Label => ({ name, id });

export const transformSpotifyPlaylistToData = ({ name, id }: SpotifyApi.PlaylistObjectSimplified): SharedTypes.Playlist => ({
  name,
  spotifyId: id,
});

export const transformPlaylistDocToData = ({ name, spotifyId }: PlaylistDocument): SharedTypes.Playlist => ({ name, spotifyId });

export const transformSpotifyTrackToData = (track: SpotifyApi.TrackObjectFull): SpotifySongData => {
  const artists = track.artists.map(artist => artist.name);
  const { spotifyId } = trackToSpotifyIdObject(track);

  return {
    artists,
    spotifyId,
    name: track.name,
    uri: track.uri,
  };
};

const transformDbIdToString = (dbId: Types.ObjectId): string => dbId.toHexString();

export const transformSongDocumentToSharedSong = (songDocument: SongDocument): SharedTypes.Song => {
  const { artists, isSaved, labels, name, playlists, spotifyId } = songDocument;

  return {
    artists,
    isSaved,
    labelIds: labels.map(transformDbIdToString),
    name,
    playlistIds: playlists,
    spotifyId,
  };
};

export const stringToObjectId = (str: string): Types.ObjectId => Types.ObjectId(str);
