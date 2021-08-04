import * as SharedTypes from "@aivarsliepa/shared";
import { Document, Schema, Types } from "mongoose";

// Song needs additional interfaces for correct transformations, when mapping API call to data, DB to data, etc./
// do not store the same info and they need to be merged
export interface SpotifySongData extends SharedTypes.SpotifyIdObject {
  name: string;
  artists: string[];
  uri: string;
}

interface SongDocumentData extends SharedTypes.SpotifyIdObject {
  labels: Types.ObjectId[]; // ref - user.labels[].id
  playlists: string[]; // ref - user.playlist[].spotifyId
  artists: string[]; // plain names
  isSaved: boolean;
  name: string;
  uri: string; // used for playing song
}

export type SongDocument = SongDocumentData & Document;

export const songSchema = new Schema<SongDocument>({
  labels: [{ required: true, type: Types.ObjectId, ref: "User.labels" }], // it does not automatically remove refences when removing
  playlists: [{ required: true, type: String }],
  spotifyId: { required: true, type: String, unique: true },
  name: { required: true, type: String },
  isSaved: { required: true, type: Boolean },
  artists: [{ required: true, type: String }],
  uri: { required: true, type: String },
});

// make sure that all fields are populated
function newSong({ name, artists, spotifyId, uri }: SpotifySongData): SongDocumentData {
  return {
    name,
    artists: [...artists],
    spotifyId,
    labels: [],
    isSaved: false,
    playlists: [],
    uri,
  };
}

/**
 * Use for creating new instances in user.songs object
 * @param spotifySong song data
 * @returns object to be past in user.songs
 */
export function createNewSong(spotifySong: SpotifySongData): SongDocument {
  return newSong(spotifySong) as SongDocument;
}
