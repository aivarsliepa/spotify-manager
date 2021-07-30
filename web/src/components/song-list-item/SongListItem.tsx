import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import WorkIcon from "@material-ui/icons/Work";

import { Song } from "../../../../shared";
import { createSongName } from "../../utils";

interface Props {
  song: Song;
}

const SongListItem: React.FC<Props> = ({ song }) => {
  const history = useHistory();
  const onClickHandler = useCallback(() => history.push(`/songs/${song.spotifyId}`), [history, song.spotifyId]);

  return (
    <ListItem button onClick={onClickHandler}>
      <ListItemAvatar>
        <Avatar>
          {/* TODO: put small image */}
          <WorkIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={createSongName(song)} />
    </ListItem>
  );
};

export default SongListItem;
