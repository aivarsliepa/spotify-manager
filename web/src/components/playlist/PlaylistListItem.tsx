import React from "react";
import { useHistory } from "react-router-dom";

import { Playlist } from "../../store/playlists/types";

interface Props {
  playlist: Playlist;
}

const SongListItem: React.FC<Props> = props => {
  const history = useHistory();

  return <li onClick={() => history.push(`/playlists/${props.playlist.spotifyId}`)}>{`${props.playlist.name}`}</li>;
};

export default SongListItem;
