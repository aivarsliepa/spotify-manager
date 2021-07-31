import * as SharedTypes from "@aivarsliepa/shared";
import { Types } from "mongoose";

import { LabelDocument } from "./Label";
import { SpotifySongData } from "./Song";
import { UserDocument } from "./User";

export const trackToSpotifyIdObject = (track: SpotifyApi.TrackObjectFull): SharedTypes.SpotifyIdObject => ({
  spotifyId: track.linked_from?.id ?? track.id,
});

export const transformLabelDocToData = ({ name, id }: LabelDocument): SharedTypes.Label => ({ name, id });

export const transformSpotifyTrackToData = (track: SpotifyApi.TrackObjectFull): SpotifySongData => {
  const artists = track.artists.map(artist => artist.name).join(", ");
  const { spotifyId } = trackToSpotifyIdObject(track);

  return {
    artists,
    spotifyId,
    name: track.name,
  };
};

const transformLabelRefToString = (labelRef: Types.ObjectId): string => labelRef.toHexString();

export const mergeAndPopulateSongData = (user: UserDocument, spotifySongData: SpotifySongData[]): SharedTypes.Song[] => {
  const populatedSongs: SharedTypes.Song[] = spotifySongData.map(({ artists, spotifyId, name }) => {
    const storedSong = user.songs.get(spotifyId);
    const labelIds = storedSong ? storedSong.labels.map(transformLabelRefToString) : [];

    return {
      artists,
      spotifyId,
      name,
      labelIds,
    };
  });

  return populatedSongs;
};

export const stringToObjectId = (str: string): Types.ObjectId => Types.ObjectId(str);
