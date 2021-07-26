import { Schema, model, Document } from "mongoose";

export interface SongData {
  spotifyId: string;
  labels: string[];
}

export type SongDocument = SongData & Document;

export interface UserData {
  spotifyId: string;
  spotifyToken: string;
  spotifyRefreshToken: string;
  spotifyTokenExpires: Date;
  songs: Map<string /* spotifyId as key */, SongData>;
}

export type UserDocument = Omit<UserData, "songs"> &
  Document & {
    songs: Map<string /* spotifyId as key */, SongDocument>;
  };

const userSchema = new Schema({
  spotifyId: { required: true, type: String, unique: true },
  spotifyToken: { required: true, type: String },
  spotifyRefreshToken: { required: true, type: String },
  spotifyTokenExpires: { required: true, type: Date },
  songs: {
    type: Map, // spotifyId as key
    of: {
      spotifyId: String,
      labels: [String],
    },
  },
});

const User = model<UserDocument>("User", userSchema);

export default User;
