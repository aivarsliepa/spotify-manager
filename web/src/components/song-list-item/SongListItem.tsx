import React from "react";
import { useHistory } from "react-router-dom";

import { Song } from "../../store/songs/types";
import SongTitle from "../SongTitle";

interface Props {
  song: Song;
}

const SongListItem: React.FC<Props> = props => {
  const history = useHistory();

  return (
    <li onClick={() => history.push(`/songs/${props.song.spotifyId}`)}>
      <SongTitle song={props.song} />
    </li>
  );
};

export default SongListItem;
