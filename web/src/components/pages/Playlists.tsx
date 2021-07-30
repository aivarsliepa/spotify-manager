import { useCallback } from "react";

import PlaylistList from "../organisms/PlaylistList";
import { useGetPlaylistsQuery } from "../../store/api";
import SpinnerTemplate from "../templates/SpinnerTemplate";

export default function Playlists() {
  const { data } = useGetPlaylistsQuery();

  const render = useCallback(() => <PlaylistList playlists={data!.playlists} />, [data]);

  return <SpinnerTemplate showSpinner={!data} render={render} />;
}
