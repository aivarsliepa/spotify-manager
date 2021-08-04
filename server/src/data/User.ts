import { Schema, model, Document, Types } from "mongoose";
import * as SharedTypes from "@aivarsliepa/shared";

import { LabelDocument, labelSchema } from "./Label";
import { SongDocument, songSchema } from "./Song";
import { PlaylistDocument, playlistSchema } from "./Playlist";

export interface UserDocument extends Document, SharedTypes.SpotifyIdObject {
  spotifyToken: string;
  spotifyRefreshToken: string;
  spotifyTokenExpires: Date;
  songs: Types.Map<SongDocument>;
  labels: Types.DocumentArray<LabelDocument>;
  playlists: Types.DocumentArray<PlaylistDocument>;
}

const userSchema = new Schema<UserDocument>({
  spotifyId: { required: true, type: String, unique: true },
  spotifyToken: { required: true, type: String },
  spotifyRefreshToken: { required: true, type: String },
  spotifyTokenExpires: { required: true, type: Date },
  songs: { required: true, type: Map, of: songSchema },
  labels: [labelSchema],
  playlists: [playlistSchema],
});

const User = model<UserDocument>("User", userSchema);

export default User;
