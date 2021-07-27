import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { Playlist } from "../../../../shared";

interface Props {
  playlist: Playlist;
}

const SongListItem: React.FC<Props> = props => {
  const history = useHistory();
  const onClickHandler = useCallback(() => history.push(`/playlists/${props.playlist.spotifyId}`), [history, props.playlist.spotifyId]);

  return <li onClick={onClickHandler}>{`${props.playlist.name}`}</li>;
};

export default SongListItem;
