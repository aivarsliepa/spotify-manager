import React from "react";
import { useParams } from "react-router-dom";

import Spinner from "../components/atoms/Spinner";
import SongDetails from "../components/SongDetails";
import { useGetSongByIdQuery } from "../store/api";

interface URLParams {
  songId: string;
}

const SongDetailPage: React.FC = () => {
  const { songId } = useParams<URLParams>();

  const { data } = useGetSongByIdQuery(songId);
  if (!data) {
    return <Spinner />;
  }

  return <SongDetails song={data} />;
};

export default SongDetailPage;
