import React, { useCallback } from "react";

import SongTitle from "./SongTitle";
import SongLabels from "./SongLabels";
import { Song } from "../../../shared";
import { useAppDispatch } from "../store/hooks";
import { playSong } from "../store/api";

interface Props {
  song: Song;
}

const SongDetails: React.FC<Props> = ({ song }) => {
  const dispatch = useAppDispatch();

  const onClickHandler = useCallback(() => {
    dispatch(playSong(song.spotifyId));
    // TODO: error handling
  }, [dispatch, song.spotifyId]);

  return (
    <div>
      <SongTitle song={song} />
      <button onClick={onClickHandler}>Play</button>
      <SongLabels song={song} />
    </div>
  );
};
export default SongDetails;
