import React from "react";
import { useHistory } from "react-router-dom";

import { Song } from "../../store/songs/types";

interface Props {
  song: Song;
}

const SongListItem: React.FC<Props> = props => {
  const history = useHistory();

  return (
    <li onClick={() => history.push(`/songs/${props.song.spotifyId}`)}>
      {`${props.song.name} - ${[props.song.artists]}`}
    </li>
  );
};

export default SongListItem;
