import React from "react";

import Spinner from "../components/atoms/Spinner";
import PlaylistList from "../components/playlist/PlaylistList";
import { useGetPlaylistsQuery } from "../store/api";

const Songs: React.FC = () => {
  const { data } = useGetPlaylistsQuery();
  if (!data) {
    return <Spinner />;
  }

  return (
    <div>
      <PlaylistList playlists={data.playlists} />
    </div>
  );
};

export default Songs;
