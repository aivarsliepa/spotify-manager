import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { Song } from "../../../../shared";
import SongTitle from "../SongTitle";

interface Props {
  song: Song;
}

const SongListItem: React.FC<Props> = props => {
  const history = useHistory();
  const onClickHandler = useCallback(() => history.push(`/songs/${props.song.spotifyId}`), [history, props.song.spotifyId]);

  return (
    <li onClick={onClickHandler}>
      <SongTitle song={props.song} />
    </li>
  );
};

export default SongListItem;
