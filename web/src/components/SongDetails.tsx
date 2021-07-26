import React, { useMemo } from "react";

import SongTitle from "./SongTitle";
import { playSong } from "../api";
import SongLabels from "./SongLabels";
import { useAppSelector } from "../store/hooks";
import { selectSongs } from "../store/songsSlice";

interface Props {
  songId?: string;
}

const SongDetails: React.FC<Props> = props => {
  const songs = useAppSelector(selectSongs);
  const song = useMemo(() => songs.find(song => song.spotifyId === props.songId), [songs, props.songId]);

  if (!song) {
    return null;
  }

  // TODO: useCallback? (behind condition :/ )
  const onClickHandler = () => {
    playSong(song.spotifyId);
  };

  return (
    <div>
      <SongTitle song={song} />
      <button onClick={onClickHandler}>Play</button>
      <SongLabels song={song} />
    </div>
  );
};
export default SongDetails;
