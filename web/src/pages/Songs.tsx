import React from "react";

import SongList from "../components/song-list/SongList";
import { useGetAllSongsQuery } from "../store/api";

const Songs: React.FC = () => {
  const { data } = useGetAllSongsQuery();

  if (!data) {
    // TODO
    return <div>Loading...</div>;
  }

  return (
    <div>
      <SongList songs={data.songs} />
    </div>
  );
};

export default Songs;
