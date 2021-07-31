import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { plusSeconds } from "../utils";

export const getSpotifyCallback: RequestHandler = (req, res) => {
  const user = req.user;

  const payload = { spotifyId: user.spotifyId };
  const token = jwt.sign(payload, process.env.SECRET_OR_KEY);

  const expires = plusSeconds(new Date(), 120);

  res.cookie("x-jwt", token, { expires });

  res.redirect(process.env.CLIENT_URI);
};
