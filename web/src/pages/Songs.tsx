import React from "react";

import Spinner from "../components/atoms/Spinner";
import SongList from "../components/song-list/SongList";
import { useGetAllSongsQuery } from "../store/api";

const Songs: React.FC = () => {
  const { data } = useGetAllSongsQuery();

  if (!data) {
    return <Spinner />;
  }

  return (
    <div>
      <SongList songs={data.songs} />
    </div>
  );
};

export default Songs;
