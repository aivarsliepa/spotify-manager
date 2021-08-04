import * as SharedTypes from "@aivarsliepa/shared";
import { Types } from "mongoose";

import { LabelDocument } from "./Label";
import { PlaylistDocument } from "./Playlist";
import { SongDocument, SpotifySongData } from "./Song";

export const transformLabelDocToData = ({ name, id }: LabelDocument): SharedTypes.Label => ({ name, id });

export const transformSpotifyPlaylistToData = ({ name, id, images }: SpotifyApi.PlaylistObjectSimplified): SharedTypes.Playlist => ({
  name,
  spotifyId: id,
  image: images[0]?.url ?? "",
});

export const transformPlaylistDocToData = ({ name, spotifyId, image }: PlaylistDocument): SharedTypes.Playlist => ({
  name,
  spotifyId,
  image,
});

export const transformSpotifyTrackToData = (track: SpotifyApi.TrackObjectFull): SpotifySongData => {
  const artists = track.artists.map(artist => artist.name);

  return {
    artists,
    spotifyId: track.linked_from?.id ?? track.id,
    name: track.name,
    uri: track.uri,
    image: track.album.images[0]?.url ?? "",
  };
};

const transformDbIdToString = (dbId: Types.ObjectId): string => dbId.toHexString();

export const transformSongDocumentToSharedSong = (songDocument: SongDocument): SharedTypes.Song => {
  const { artists, isSaved, labels, name, playlists, spotifyId, image } = songDocument;

  return {
    artists,
    isSaved,
    labelIds: labels.map(transformDbIdToString),
    name,
    playlistIds: playlists,
    spotifyId,
    image,
  };
};

export const stringToObjectId = (id: string): Types.ObjectId => Types.ObjectId(id);
