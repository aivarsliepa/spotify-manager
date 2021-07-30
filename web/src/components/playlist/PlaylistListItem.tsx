import React, { useCallback } from "react";
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import WorkIcon from "@material-ui/icons/Work";
import { useHistory } from "react-router-dom";

import { Playlist } from "../../../../shared";

interface Props {
  playlist: Playlist;
}

const SongListItem: React.FC<Props> = props => {
  const history = useHistory();
  const onClickHandler = useCallback(() => history.push(`/playlists/${props.playlist.spotifyId}`), [history, props.playlist.spotifyId]);

  return (
    <ListItem button onClick={onClickHandler}>
      <ListItemAvatar>
        <Avatar>
          <WorkIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={props.playlist.name} />
    </ListItem>
  );
};

export default SongListItem;
