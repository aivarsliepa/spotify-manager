import { Document, Schema } from "mongoose";

interface PlaylistData {
  name: string;
  spotifyId: string;
}

export type PlaylistDocument = PlaylistData & Document;

export const playlistSchema = new Schema<PlaylistDocument>({
  name: { required: true, type: String, unique: true },
  spotifyId: { required: true, type: String, unique: true },
});
