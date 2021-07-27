import React from "react";

import PlaylistList from "../components/playlist/PlaylistList";
import { useGetPlaylistsQuery } from "../store/api";

const Songs: React.FC = () => {
  const { data } = useGetPlaylistsQuery();
  if (!data) {
    // TODO
    return <div>Loading...</div>;
  }

  return (
    <div>
      <PlaylistList playlists={data.playlists} />
    </div>
  );
};

export default Songs;
