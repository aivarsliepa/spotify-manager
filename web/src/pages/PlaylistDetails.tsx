import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import { fetchSongsForPlaylist } from "../api";
import SongList from "../components/song-list/SongList";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectSongs, setSongs } from "../store/songsSlice";

const PlaylistDetails: React.FC = () => {
  const dispatch = useAppDispatch();
  const songs = useAppSelector(selectSongs);

  const { playlistId } = useParams<{ playlistId: string }>();

  useEffect(() => {
    if (playlistId) {
      // TODO error handling
      fetchSongsForPlaylist(playlistId)
        .then(res => dispatch(setSongs(res.songs)))
        .catch(console.error);
    }
  }, [playlistId, dispatch]);

  return (
    <div>
      <SongList songs={songs} />
    </div>
  );
};

export default PlaylistDetails;
