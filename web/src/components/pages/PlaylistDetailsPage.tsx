import { useCallback } from "react";
import { useParams } from "react-router-dom";

import SongList from "../organisms/SongList";
import { useGetSongsQuery } from "../../store/api";
import SpinnerTemplate from "../templates/SpinnerTemplate";

export default function PlaylistDetails() {
  const { playlistId } = useParams<{ playlistId: string }>();
  const { data } = useGetSongsQuery({ playlistId });

  const render = useCallback(() => <SongList songs={data!.songs} />, [data]);

  return <SpinnerTemplate showSpinner={!data} render={render} />;
}
