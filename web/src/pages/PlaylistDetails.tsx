import React from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/atoms/Spinner";

import SongList from "../components/song-list/SongList";
import { useGetSongsByPlaylistIdQuery } from "../store/api";

const PlaylistDetails: React.FC = () => {
  const { playlistId } = useParams<{ playlistId: string }>();

  const { data } = useGetSongsByPlaylistIdQuery(playlistId);
  if (!data) {
    return <Spinner />;
  }

  return (
    <div>
      <SongList songs={data.songs} />
    </div>
  );
};

export default PlaylistDetails;
