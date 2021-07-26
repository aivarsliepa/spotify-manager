import React, { useEffect } from "react";

import { fetchSongs } from "../api";
import SongList from "../components/song-list/SongList";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectSongs, setSongs } from "../store/songsSlice";

const Songs: React.FC = () => {
  const dispatch = useAppDispatch();
  const songs = useAppSelector(selectSongs);

  useEffect(() => {
    // TODO: error handling
    fetchSongs() // TODO: redux toolkit API
      .then(({ songs }) => dispatch(setSongs(songs)))
      .catch(console.log);
  }, [dispatch]);

  return (
    <div>
      <SongList songs={songs} />
    </div>
  );
};

export default Songs;
