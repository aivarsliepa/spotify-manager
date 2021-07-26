import React, { useEffect } from "react";

import { fetchPlaylists } from "../api";
import PlaylistList from "../components/playlist/PlaylistList";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectPlaylists, setPlaylists } from "../store/playlistsSlice";

const Songs: React.FC = () => {
  const dispatch = useAppDispatch();
  const playlists = useAppSelector(selectPlaylists);

  useEffect(() => {
    // TODO: error handling
    fetchPlaylists()
      .then(({ playlists }) => dispatch(setPlaylists(playlists)))
      .catch(console.log);
  }, [dispatch]);

  return (
    <div>
      <PlaylistList playlists={playlists} />
    </div>
  );
};

export default Songs;
