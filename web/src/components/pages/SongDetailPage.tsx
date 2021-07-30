import { useCallback } from "react";
import { useParams } from "react-router-dom";

import SongDetails from "../organisms/SongDetails";
import { useGetSongByIdQuery } from "../../store/api";
import SpinnerTemplate from "../templates/SpinnerTemplate";

interface URLParams {
  songId: string;
}

export default function SongDetailPage() {
  const { songId } = useParams<URLParams>();
  const { data } = useGetSongByIdQuery(songId);

  const render = useCallback(() => <SongDetails song={data!} />, [data]);

  return <SpinnerTemplate showSpinner={!data} render={render} />;
}
