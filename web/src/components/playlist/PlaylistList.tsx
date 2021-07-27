import React from "react";

import { Playlist } from "../../../../shared";
import PlaylistListItem from "./PlaylistListItem";

interface Props {
  playlists: Playlist[];
}

const PlaylistList: React.FC<Props> = props => {
  const list = props.playlists.map(playlist => <PlaylistListItem playlist={playlist} key={playlist.spotifyId} />);

  return <ul>{list}</ul>;
};

export default PlaylistList;
