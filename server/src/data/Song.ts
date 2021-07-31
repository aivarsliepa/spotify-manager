import * as SharedTypes from "@aivarsliepa/shared";
import { Document, Schema, Types } from "mongoose";

// Song needs additional interfaces for correct transformations, when mapping API call to data, DB to data, etc./
// do not store the same info and they need to be merged
export interface SpotifySongData extends SharedTypes.SpotifyIdObject {
  artists: string;
  name: string;
}

// TODO: can probably be removed
interface SongData extends SharedTypes.SpotifyIdObject {
  labels: string[]; // just IDs
}

export interface SongDocument extends Document, SharedTypes.SpotifyIdObject {
  labels: Types.ObjectId[];
}

export const songSchema = new Schema<SongDocument>({
  labels: { required: true, type: [Types.ObjectId] },
  spotifyId: { required: true, type: String },
});
