import React from "react";
import { useParams } from "react-router-dom";

import SongDetails from "../components/SongDetails";

interface URLParams {
  songId: string;
}

const SongDetailPage: React.FC = () => {
  const { songId } = useParams<URLParams>();

  return <SongDetails songId={songId} />;
};

export default SongDetailPage;
